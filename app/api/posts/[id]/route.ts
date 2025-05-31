import { NextRequest, NextResponse } from 'next/server';
import { PrismaPostRepository } from '@/backend/infra/repositories/prisma/PrismaPostRepository';
import { GetPostByIdUseCase } from '@/backend/application/usecases/post/GetPostByIdUsecase';
import { DeletePostUseCase } from '@/backend/application/usecases/post/DeletePostUseCase';
import { UpdatePostUseCase, UpdatePostDto } from '@/backend/application/usecases/post/UpdatePostUseCase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

const postRepository = new PrismaPostRepository(prisma);
const getPostByIdUseCase = new GetPostByIdUseCase(postRepository);
const deletePostUseCase = new DeletePostUseCase(postRepository);
const updatePostUseCase = new UpdatePostUseCase(postRepository);

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
    }

    const post = await getPostByIdUseCase.execute(postId);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
    }

    // 인증 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 요청 본문 파싱
    const body = await request.json();
    const dto: UpdatePostDto = {
      title: body.title,
      content: body.content,
      contentHTML: body.contentHTML,
      tags: body.tags || [],
    };

    // 게시물 수정
    const updatedPost = await updatePostUseCase.execute(postId, session.user.id, dto);

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error: any) {
    console.error('Error updating post:', error);

    // 커스텀 에러 메시지 처리
    if (error.message.includes('게시물을 찾을 수 없습니다')) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    if (error.message.includes('권한이 없습니다')) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
    }

    await deletePostUseCase.execute(postId, session.user.id);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
