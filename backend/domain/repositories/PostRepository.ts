import { Post, PostResponse } from '@/backend/domain/entities/Post';
import { Tag } from '@/backend/domain/entities/Tag';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedPosts {
  posts: PostResponse[];
  hasMore: boolean;
  total: number;
}

export interface PostRepository {
  create(post: Post): Promise<Post>;
  findById(id: number): Promise<Post | null>;
  findAll(params: PaginationParams): Promise<PaginatedPosts>;
  addTags(postId: number, tags: Tag[]): Promise<void>;
  updateTags(postId: number, tags: Tag[]): Promise<void>;
  update(id: number, post: Post): Promise<Post>;
  delete(id: number): Promise<void>;
}
