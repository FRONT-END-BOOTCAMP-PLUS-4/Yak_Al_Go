import { Tag, CreateTagDTO, UpdateTagDTO } from '@/backend/domain/entities/tagEntity';

export interface TagRepository {
  findAll(): Promise<Tag[]>;
  findById(id: string): Promise<Tag | null>;
  create(data: CreateTagDTO): Promise<Tag>;
  update(id: string, data: UpdateTagDTO): Promise<Tag>;
  delete(id: string): Promise<void>;
}
