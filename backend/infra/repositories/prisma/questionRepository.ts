import { PrismaClient } from '@prisma/client';
import { Question } from '../../../domain/entities/questionEntity';
import {
  PaginationParams,
  PaginatedQuestions,
  QuestionRepository,
} from '../../../domain/repositories/questionRepository';

type PrismaQuestion = {
  id: number;
  title: string;
  content: any;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  userId: string;
};

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

  async findById(id: number): Promise<Question | null> {
    const question = await this.prisma.qnas.findUnique({
      where: { id },
    });

    if (!question) return null;

    return this.mapToEntity(question);
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
      }),
      this.prisma.qnas.count({
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

  private mapToEntity(prismaQuestion: PrismaQuestion): Question {
    return new Question({
      id: prismaQuestion.id,
      title: prismaQuestion.title,
      content: prismaQuestion.content,
      createdAt: prismaQuestion.created_at,
      updatedAt: prismaQuestion.updated_at,
      deletedAt: prismaQuestion.deleted_at,
      userId: prismaQuestion.userId,
    });
  }
}
