import { QuestionRepository } from '@/backend/domain/repositories/QuestionRepository';
import { PaginationParams, PaginatedQuestions } from '@/backend/domain/repositories/QuestionRepository';

export class GetAllQuestionsUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedQuestions> {
    return this.questionRepository.findAll(params);
  }
}
