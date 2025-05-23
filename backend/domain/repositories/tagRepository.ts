import { Tag } from '@/backend/domain/entities/tagEntity';
import { CreateTagDto } from '@/backend/dto/createTagDto';

export interface TagRepository {
  findAll(): Promise<Tag[]>;
  findById(id: string): Promise<Tag | null>;
  create(data: CreateTagDto): Promise<Tag>;
  delete(id: string): Promise<void>;
}
