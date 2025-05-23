import { Question } from '../entities/QuestionEntity';
import { Tag } from '../entities/TagEntity';
import { QuestionResponseDto } from '@/backend/dto/QuestionDto';
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedQuestions {
  questions: Question[];
  hasMore: boolean;
  total: number;
}

export interface QuestionRepository {
  create(question: Question): Promise<Question>;
  findById(id: number): Promise<QuestionResponseDto | null>;
  findAll(params: PaginationParams): Promise<PaginatedQuestions>;
  update(id: number, question: Partial<Question>): Promise<Question>;
  delete(id: number): Promise<void>;
  addTags(questionId: number, tags: Tag[]): Promise<void>;
  removeTag(questionId: number, tagId: number): Promise<void>;
  getTags(questionId: number): Promise<Tag[]>;
  getAnswerCount(questionId: number): Promise<number>;
}
