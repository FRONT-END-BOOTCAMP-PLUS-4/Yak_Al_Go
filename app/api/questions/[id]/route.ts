import { NextRequest, NextResponse } from 'next/server';
import { PrismaQuestionRepository } from '@/backend/infra/repositories/prisma/PrismaQuestionRepository';
import { GetQuestionByIdUseCase } from '@/backend/application/usecases/question/GetQuestionByIdUseCase';
import prisma from '@/lib/prisma';

const questionRepository = new PrismaQuestionRepository(prisma);
const getQuestionByIdUseCase = new GetQuestionByIdUseCase(questionRepository);

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const questionId = parseInt(params.id);

    if (isNaN(questionId)) {
      return NextResponse.json({ message: 'Invalid question ID' }, { status: 400 });
    }

    const question = await getQuestionByIdUseCase.execute(questionId);

    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
