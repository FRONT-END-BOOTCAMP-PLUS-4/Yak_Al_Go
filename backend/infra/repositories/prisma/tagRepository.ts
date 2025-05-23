import { PrismaClient } from '@prisma/client';
import { TagRepository } from '@/backend/domain/repositories/tagRepository';
import { Tag } from '@/backend/domain/entities/tagEntity';

export class PrismaTagRepository implements TagRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Tag[]> {
    const tags = await this.prisma.tags.findMany();
    return tags.map((tag: { id: number; tag_name: string }) => new Tag({ id: tag.id, name: tag.tag_name }));
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await this.prisma.tags.findUnique({
      where: { id: Number(id) },
    });
    if (!tag) return null;
    return new Tag({ id: tag.id, name: tag.tag_name });
  }

  async create(data: Tag): Promise<Tag> {
    const tag = await this.prisma.tags.create({
      data: {
        tag_name: data.name,
      },
    });
    return {
      id: tag.id,
      name: tag.tag_name,
    };
  }

  async update(id: string, data: Tag): Promise<Tag> {
    const tag = await this.prisma.tags.update({
      where: { id: Number(id) },
      data: {
        tag_name: data.name,
      },
    });
    return {
      id: tag.id,
      name: tag.tag_name,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tags.delete({
      where: { id: Number(id) },
    });
  }
}
