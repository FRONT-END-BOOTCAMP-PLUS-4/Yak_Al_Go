import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // QNA 게시글 조회
    const qnas = await prisma.qnas.findMany({
      where: {
        userId: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        _count: {
          select: {
            answers: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 일반 게시글 조회
    const posts = await prisma.posts.findMany({
      where: {
        userId: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        _count: {
          select: {
            comments: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      qnas: qnas.map((qna) => ({
        id: qna.id,
        title: qna.title,
        date: qna.createdAt.toISOString().split('T')[0],
        answers: qna._count.answers,
        type: 'expert'
      })),
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        date: post.createdAt.toISOString().split('T')[0],
        answers: post._count.comments,
        type: 'community'
      }))
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post data' },
      { status: 500 }
    );
  }
}