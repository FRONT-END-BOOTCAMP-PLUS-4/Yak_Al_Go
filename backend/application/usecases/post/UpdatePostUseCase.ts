import { PostRepository } from '@/backend/domain/repositories/PostRepository';
import { Post } from '@/backend/domain/entities/Post';
import { Tag } from '@/backend/domain/entities/Tag';

export interface UpdatePostDto {
  title: string;
  content: any;
  contentHTML: string;
  tags: Tag[];
}

export class UpdatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(postId: number, userId: string, dto: UpdatePostDto): Promise<Post> {
    // 게시물 존재 여부 확인
    const existingPost = await this.postRepository.findById(postId);
    if (!existingPost) {
      throw new Error('게시물을 찾을 수 없습니다.');
    }

    // 게시물 작성자 확인
    if (existingPost.userId !== userId) {
      throw new Error('게시물을 수정할 권한이 없습니다.');
    }

    // Post는 댓글이 있어도 수정 가능 (Question과 다른 정책)

    // 게시물 수정
    const updatedPost = new Post({
      id: postId,
      title: dto.title,
      content: dto.content,
      contentHTML: dto.contentHTML,
      userId: existingPost.userId,
      createdAt: existingPost.createdAt,
      updatedAt: new Date(),
    });

    const result = await this.postRepository.update(postId, updatedPost);

    // 태그 업데이트 (기존 태그 삭제 후 새 태그 추가)
    await this.postRepository.updateTags(postId, dto.tags);

    return result;
  }
}
