import { QuestionRepository } from '@/backend/domain/repositories/QuestionRepository';
import { QuestionResponseDto } from '@/backend/application/usecases/question/dto/QuestionDto';

export class GetQuestionByIdUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute(id: number): Promise<QuestionResponseDto | null> {
    // findById already includes tags and answer count through Prisma's include
    const question = await this.questionRepository.findById(id);
    return question;
  }
}
