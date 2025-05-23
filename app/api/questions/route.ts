import { NextRequest, NextResponse } from 'next/server';
import { PrismaQuestionRepository } from '@/backend/infra/repositories/prisma/questionRepository';
import { CreateQuestionDto } from '@/backend/dto/questionDto';
import { CreateQuestionUseCase } from '@/backend/application/usecases/question/createQuestionUseCase';
import { FindAllQuestionsUseCase } from '@/backend/application/usecases/question/findAllQuestionsUseCase';
import prisma from '@/lib/prisma';

const questionRepository = new PrismaQuestionRepository(prisma);
const createQuestionUseCase = new CreateQuestionUseCase(questionRepository);
const findAllQuestionsUseCase = new FindAllQuestionsUseCase(questionRepository);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dto: CreateQuestionDto = {
      title: body.title,
      content: body.content,
      userId: body.userId,
    };

    const result = await createQuestionUseCase.execute(dto);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await findAllQuestionsUseCase.execute({ page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
