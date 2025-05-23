import { Question } from '@/backend/domain/entities/questionEntity';
import { Tag } from '@/backend/domain/entities/tagEntity';
import {
  PaginationParams,
  PaginatedQuestions,
  QuestionRepository,
} from '@/backend/domain/repositories/questionRepository';

import prisma from '@/lib/prisma';

type PrismaQuestion = {
  id: number;
  title: string;
  content: any;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  userId: string;
  qna_tags?: {
    tags: {
      id: number;
      tag_name: string;
    };
  }[];
  _count?: {
    answers: number;
  };
};

type PrismaQnATag = {
  tags: {
    id: number;
    tag_name: string;
  };
};

export class PrismaQuestionRepository implements QuestionRepository {
  async create(question: Question): Promise<Question> {
    const created = await prisma.qnas.create({
      data: {
        title: question.title,
        content: question.content,
        userId: question.userId,
      },
    });

    return this.mapToEntity(created);
  }

  async findById(id: number): Promise<Question | null> {
    const question = await prisma.qnas.findUnique({
      where: { id },
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
    });

    if (!question) return null;

    return this.mapToEntity(question);
  }

  async findAll(params: PaginationParams): Promise<PaginatedQuestions> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      prisma.qnas.findMany({
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
      prisma.qnas.count({
        where: { deleted_at: null },
      }),
    ]);

    const hasMore = questions.length > limit;
    const items = hasMore ? questions.slice(0, -1) : questions;

    return {
      questions: items.map((q: PrismaQuestion) => this.mapToEntity(q)),
      hasMore,
      total,
    };
  }

  async update(id: number, question: Partial<Question>): Promise<Question> {
    const updated = await prisma.qnas.update({
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
    await prisma.qnas.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async addTag(questionId: number, tag: Tag): Promise<void> {
    await prisma.qna_tags.create({
      data: {
        qnaId: questionId,
        tagId: tag.id!,
      },
    });
  }

  async removeTag(questionId: number, tagId: number): Promise<void> {
    await prisma.qna_tags.deleteMany({
      where: {
        qnaId: questionId,
        tagId,
      },
    });
  }

  async getTags(questionId: number): Promise<Tag[]> {
    const question = await prisma.qnas.findUnique({
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

    return question.qna_tags.map(
      (qt: PrismaQnATag) =>
        new Tag({
          id: qt.tags.id,
          tagName: qt.tags.tag_name,
        })
    );
  }

  async getAnswerCount(questionId: number): Promise<number> {
    const count = await prisma.answers.count({
      where: {
        qnaId: questionId,
      },
    });

    return count;
  }

  private mapToEntity(prismaQuestion: PrismaQuestion): Question {
    return new Question({
      id: prismaQuestion.id,
      title: prismaQuestion.title,
      content: prismaQuestion.content,
      createdAt: prismaQuestion.created_at,
      updatedAt: prismaQuestion.updated_at,
      deletedAt: prismaQuestion.deleted_at,
      userId: prismaQuestion.userId,
      tags: prismaQuestion.qna_tags?.map(
        (qt: PrismaQnATag) =>
          new Tag({
            id: qt.tags.id,
            tagName: qt.tags.tag_name,
          })
      ),
      answerCount: prismaQuestion._count?.answers,
    });
  }
}
