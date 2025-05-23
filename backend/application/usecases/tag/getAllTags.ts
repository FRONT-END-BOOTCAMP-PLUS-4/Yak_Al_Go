import { TagRepository } from '@/backend/domain/repositories/tagRepository';
import { Tag } from '@/backend/domain/entities/tagEntity';

export class GetAllTagsUseCase {
  constructor(private tagRepository: TagRepository) {}

  async execute(): Promise<Tag[]> {
    return this.tagRepository.findAll();
  }
}
