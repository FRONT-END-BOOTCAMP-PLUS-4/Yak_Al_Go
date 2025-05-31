import { Post, PostResponse } from '@/backend/domain/entities/Post';
import { Tag } from '@/backend/domain/entities/Tag';
import { User } from '@/backend/domain/entities/User';
import { PaginationParams, PaginatedPosts, PostRepository } from '@/backend/domain/repositories/PostRepository';
import { PrismaClient } from '@prisma/client';

export class PrismaPostRepository implements PostRepository {
  constructor(private prisma: PrismaClient) {}

  async create(post: Post): Promise<Post> {
    const created = await this.prisma.posts.create({
      data: {
        title: post.title,
        content: post.content,
        contentHTML: post.contentHTML,
        userId: post.userId,
      },
    });

    return new Post({
      id: created.id,
      title: created.title,
      content: created.content,
      contentHTML: created.contentHTML,
      createdAt: created.createdAt,
      userId: created.userId,
      comments: created.comments,
    });
  }

  async addTags(postId: number, tags: Tag[]): Promise<void> {
    await this.prisma.posts_tags.createMany({
      data: tags.map((t) => ({
        postId: postId,
        tagId: t.id,
      })),
    });
  }

  async findById(id: number): Promise<Post | null> {
    const post = await this.prisma.posts.findUnique({
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
        postTags: {
          include: {
            tags: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
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

    if (!post) return null;

    return new Post({
      id: post.id,
      title: post.title,
      content: post.content,
      contentHTML: post.contentHTML,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      userId: post.userId,
      user: post.users
        ? new User({
            id: post.users.id,
            name: post.users.name,
            email: post.users.email,
            image: post.users.photo || '',
            member_type: post.users.member_type,
          })
        : undefined,
      tags: post.postTags?.map((pt: any) => new Tag({ id: pt.tags.id, name: pt.tags.tagName })),
      comments: post.comments?.map((c: any) => ({
        ...c,
        user: c.users
          ? new User({
              id: c.users.id,
              name: c.users.name,
              email: c.users.email,
              image: c.users.photo || '',
              member_type: c.users.member_type,
            })
          : undefined,
      })),
    });
  }

  async findAll(params: PaginationParams): Promise<PaginatedPosts> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.posts.findMany({
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
          postTags: {
            include: {
              tags: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      this.prisma.posts.count({
        where: { deletedAt: null },
      }),
    ]);

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, -1) : posts;

    return {
      posts: items.map(
        (p: any) =>
          new PostResponse({
            id: p.id,
            title: p.title,
            content: p.content,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            user: new User({
              id: p.users.id,
              name: p.users.name,
              email: p.users.email,
              image: p.users.photo || '',
              member_type: p.users.member_type,
            }),
            tags: p.postTags?.map((pt: any) => new Tag({ id: pt.tags.id, name: pt.tags.tagName })),
            commentCount: p._count.comments,
          })
      ),
      hasMore,
      total,
    };
  }

  async updateTags(postId: number, tags: Tag[]): Promise<void> {
    // 기존 태그 연결 삭제
    await this.prisma.posts_tags.deleteMany({
      where: { postId: postId },
    });

    // 새 태그 연결 추가
    if (tags.length > 0) {
      await this.prisma.posts_tags.createMany({
        data: tags.map((t) => ({
          postId: postId,
          tagId: t.id,
        })),
      });
    }
  }

  async update(id: number, post: Post): Promise<Post> {
    const updated = await this.prisma.posts.update({
      where: { id },
      data: {
        title: post.title,
        content: post.content,
        contentHTML: post.contentHTML,
        updatedAt: new Date(),
      },
    });

    return new Post({
      id: updated.id,
      title: updated.title,
      content: updated.content,
      contentHTML: updated.contentHTML,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      userId: updated.userId,
    });
  }

  async delete(id: number): Promise<void> {
    // 소프트 삭제로 구현 (deletedAt 필드 설정)
    await this.prisma.posts.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
