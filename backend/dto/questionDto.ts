import { Tag } from '@/backend/domain/entities/tagEntity';

export interface CreateQuestionDto {
  title: string;
  content: any;
  userId: string;
  tags: Tag[];
}

export interface QuestionResponseDto {
  id?: number;
  title: string;
  content: any;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
}
