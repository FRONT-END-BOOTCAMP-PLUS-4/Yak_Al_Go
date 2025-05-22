import { QuestionRepository } from '../../../domain/repositories/questionRepository';
import { PaginationParams, PaginatedQuestions } from '../../../domain/repositories/questionRepository';

export class FindAllQuestionsUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedQuestions> {
    return this.questionRepository.findAll(params);
  }
}
