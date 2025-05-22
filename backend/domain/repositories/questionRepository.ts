import { Question } from '../entities/questionEntity';

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
  findById(id: number): Promise<Question | null>;
  findAll(params: PaginationParams): Promise<PaginatedQuestions>;
  update(id: number, question: Partial<Question>): Promise<Question>;
  delete(id: number): Promise<void>;
}
