import { Question } from '@/backend/domain/entities/QuestionEntity';
import { Tag } from '@/backend/domain/entities/TagEntity';
import {
  PaginationParams,
  PaginatedQuestions,
  QuestionRepository,
} from '@/backend/domain/repositories/QuestionRepository';
import { PrismaClient } from '@prisma/client';
import { QuestionResponseDto } from '@/backend/application/usecases/question/dto/QuestionDto';

export class PrismaQuestionRepository implements QuestionRepository {
  constructor(private prisma: PrismaClient) {}

  async create(question: Question): Promise<Question> {
    const created = await this.prisma.qnas.create({
      data: {
        title: question.title,
        content: question.content,
        userId: question.userId,
      },
    });

    return this.mapToEntity(created);
  }

  async findById(id: number): Promise<QuestionResponseDto | null> {
    const question = await this.prisma.qnas.findUnique({
      where: { id },
      include: {
        qna_tags: {
          include: {
            tags: true,
          },
        },
        answers: {
          select: {
            id: true,
            content: true,
            created_at: true,
            updated_at: true,
            users: {
              select: {
                id: true,
                name: true,
                member_type: true,
              },
            },
          },
        },
      },
    });

    if (!question) return null;

    return {
      ...this.mapToEntity(question),
      tags:
        question.qna_tags?.map((qt: any) => ({
          id: qt.tags.id,
          name: qt.tags.tag_name,
        })) || [],
      answers: question.answers,
    };
  }

  async findAll(params: PaginationParams): Promise<PaginatedQuestions> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      this.prisma.qnas.findMany({
        where: { deleted_at: null },
        orderBy: { created_at: 'desc' },
        take: limit + 1, // fetch one extra to determine if there are more items
        skip,
        include: {
          qna_tags: {
            include: {
              tags: true,
            },
          },
          _count: {
            select: {
              answers: true,
            },
          },
        },
      }),
      this.prisma.qnas.count({
        where: { deleted_at: null },
      }),
    ]);

    const hasMore = questions.length > limit;
    const items = hasMore ? questions.slice(0, -1) : questions;

    return {
      questions: items.map((q: any) => this.mapToEntity(q)),
      hasMore,
      total,
    };
  }

  async update(id: number, question: Partial<Question>): Promise<Question> {
    const updated = await this.prisma.qnas.update({
      where: { id },
      data: {
        title: question.title,
        content: question.content,
        updated_at: new Date(),
      },
    });

    return this.mapToEntity(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.qnas.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async addTags(questionId: number, tags: Tag[]): Promise<void> {
    await this.prisma.qna_tags.createMany({
      data: tags.map((tag) => ({
        qnaId: questionId,
        tagId: tag.id,
      })),
    });
  }

  async removeTag(questionId: number, tagId: number): Promise<void> {
    await this.prisma.qna_tags.deleteMany({
      where: {
        qnaId: questionId,
        tagId,
      },
    });
  }

  async getTags(questionId: number): Promise<Tag[]> {
    const question = await this.prisma.qnas.findUnique({
      where: { id: questionId },
      include: {
        qna_tags: {
          include: {
            tags: true,
          },
        },
      },
    });

    if (!question) return [];

    return question.qna_tags.map((qt: any) => new Tag({ id: qt.tags.id, name: qt.tags.tag_name }));
  }

  async getAnswerCount(questionId: number): Promise<number> {
    const count = await this.prisma.answers.count({
      where: {
        qnaId: questionId,
      },
    });

    return count;
  }

  private mapToEntity(prismaQuestion: any): Question {
    return new Question({
      id: prismaQuestion.id,
      title: prismaQuestion.title,
      content: prismaQuestion.content,
      createdAt: prismaQuestion.created_at,
      updatedAt: prismaQuestion.updated_at,
      deletedAt: prismaQuestion.deleted_at,
      userId: prismaQuestion.userId,
      tags: prismaQuestion.qna_tags?.map(
        (qt: any) =>
          new Tag({
            id: qt.tags.id,
            name: qt.tags.tag_name,
          })
      ),
      answerCount: prismaQuestion._count?.answers,
    });
  }
}
