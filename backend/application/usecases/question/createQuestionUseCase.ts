import { Question } from '../../../domain/entities/questionEntity';
import { QuestionRepository } from '../../../domain/repositories/questionRepository';
import { CreateQuestionDto, QuestionResponseDto } from '@/backend/dto/questionDto';

export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute(dto: CreateQuestionDto): Promise<QuestionResponseDto> {
    const question = new Question({
      title: dto.title,
      content: dto.content,
      userId: dto.userId,
    });

    const created = await this.questionRepository.create(question);

    return {
      id: created.id,
      title: created.title,
      content: created.content,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      userId: created.userId,
    };
  }
}
