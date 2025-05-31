import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const userHealths = await prisma.user_healths.findMany({
      where: {
        userId: userId,
      },
      include: {
        healths: true,
      },
    });

    return NextResponse.json(
      userHealths.map((uh) => ({
        id: uh.id,
        healthId: uh.healthId,
        healthName: uh.healths.health_name,
      }))
    );
  } catch (error) {
    console.error('Error fetching user healths:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health data' },
      { status: 500 }
    );
  }
}