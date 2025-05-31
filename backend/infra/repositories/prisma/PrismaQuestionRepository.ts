import { Question, QuestionResponse } from '@/backend/domain/entities/Question';
import { Tag } from '@/backend/domain/entities/Tag';
import { User } from '@/backend/domain/entities/User';
import {
  PaginationParams,
  PaginatedQuestions,
  QuestionRepository,
} from '@/backend/domain/repositories/QuestionRepository';
import { PrismaClient } from '@prisma/client';

export class PrismaQuestionRepository implements QuestionRepository {
  constructor(private prisma: PrismaClient) {}

  async create(question: Question): Promise<Question> {
    const created = await this.prisma.qnas.create({
      data: {
        title: question.title,
        content: question.content,
        contentHTML: question.contentHTML,
        userId: question.userId,
      },
    });

    return new Question({
      id: created.id,
      title: created.title,
      content: created.content,
      contentHTML: created.contentHTML,
      createdAt: created.createdAt,
      userId: created.userId,
      answers: created.answers,
    });
  }

  async addTags(questionId: number, tags: Tag[]): Promise<void> {
    await this.prisma.qna_tags.createMany({
      data: tags.map((t) => ({
        qnaId: questionId,
        tagId: t.id,
      })),
    });
  }

  async findById(id: number): Promise<Question | null> {
    const question = await this.prisma.qnas.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            photo: true,
            member_type: true,
          },
        },
        qnaTags: {
          include: {
            tags: true,
          },
        },
        answers: {
          select: {
            id: true,
            content: true,
            contentHTML: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            users: {
              select: {
                id: true,
                name: true,
                email: true,
                photo: true,
                member_type: true,
              },
            },
          },
        },
      },
    });

    if (!question) return null;

    return new Question({
      id: question.id,
      title: question.title,
      content: question.content,
      contentHTML: question.contentHTML,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      userId: question.userId,
      user: question.users
        ? new User({
            id: question.users.id,
            name: question.users.name,
            email: question.users.email,
            image: question.users.photo || '',
            member_type: question.users.member_type,
          })
        : undefined,
      tags: question.qnaTags?.map((qt: any) => new Tag({ id: qt.tags.id, name: qt.tags.tagName })),
      answers: question.answers?.map((a: any) => ({
        ...a,
        user: a.users
          ? new User({
              id: a.users.id,
              name: a.users.name,
              email: a.users.email,
              image: a.users.photo || '',
              member_type: a.users.member_type,
            })
          : undefined,
      })),
    });
  }

  async findAll(params: PaginationParams): Promise<PaginatedQuestions> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      this.prisma.qnas.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: limit + 1, // fetch one extra to determine if there are more items
        skip,
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              photo: true,
              member_type: true,
            },
          },
          qnaTags: {
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
        where: { deletedAt: null },
      }),
    ]);

    const hasMore = questions.length > limit;
    const items = hasMore ? questions.slice(0, -1) : questions;

    return {
      questions: items.map(
        (q: any) =>
          new QuestionResponse({
            id: q.id,
            title: q.title,
            content: q.content,
            createdAt: q.createdAt,
            updatedAt: q.updatedAt,
            user: new User({
              id: q.users.id,
              name: q.users.name,
              email: q.users.email,
              image: q.users.photo || '',
              member_type: q.users.member_type,
            }),
            tags: q.qnaTags?.map((qt: any) => new Tag({ id: qt.tags.id, name: qt.tags.tagName })),
            answerCount: q._count.answers,
          })
      ),
      hasMore,
      total,
    };
  }

  async delete(id: number, userId: string): Promise<void> {
    // 먼저 질문이 존재하고 해당 사용자의 것인지 확인
    const question = await this.prisma.qnas.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!question) {
      throw new Error('질문을 찾을 수 없습니다.');
    }

    if (question.userId !== userId) {
      throw new Error('질문을 삭제할 권한이 없습니다.');
    }

    // 질문 소프트 삭제 (deletedAt 필드 설정)
    await this.prisma.qnas.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async hasAnswers(id: number): Promise<boolean> {
    const answerCount = await this.prisma.answers.count({
      where: { qnaId: id },
    });
    return answerCount > 0;
  }

  async update(id: number, question: Question): Promise<Question> {
    const updated = await this.prisma.qnas.update({
      where: { id },
      data: {
        title: question.title,
        content: question.content,
        contentHTML: question.contentHTML,
        updatedAt: new Date(),
      },
    });

    return new Question({
      id: updated.id,
      title: updated.title,
      content: updated.content,
      contentHTML: updated.contentHTML,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      userId: updated.userId,
    });
  }

  async updateTags(questionId: number, tags: Tag[]): Promise<void> {
    // 기존 태그 연결 삭제
    await this.prisma.qna_tags.deleteMany({
      where: { qnaId: questionId },
    });

    // 새 태그 연결 추가
    if (tags.length > 0) {
      await this.prisma.qna_tags.createMany({
        data: tags.map((t) => ({
          qnaId: questionId,
          tagId: t.id,
        })),
      });
    }
  }
}
