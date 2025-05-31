import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return NextResponse.json({ message: 'User withdrawn successfully' });
  } catch (error) {
    console.error('Error withdrawing user:', error);
    return NextResponse.json(
      { error: 'Failed to withdraw user' },
      { status: 500 }
    );
  }
}