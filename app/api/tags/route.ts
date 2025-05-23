import { NextResponse } from 'next/server';
import { PrismaTagRepository } from '@/backend/infra/repositories/prisma/PrismaTagRepository';
import { GetAllTagsUseCase } from '@/backend/application/usecases/tag/GetAllTagsUsecase';
import prisma from '@/lib/prisma';

const tagRepository = new PrismaTagRepository(prisma);
const getAllTagsUseCase = new GetAllTagsUseCase(tagRepository);

export async function GET() {
  try {
    const tags = await getAllTagsUseCase.execute();

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}
