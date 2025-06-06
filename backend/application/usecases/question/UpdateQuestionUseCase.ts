import { QuestionRepository } from '@/backend/domain/repositories/QuestionRepository';
import { AnswerRepository } from '@/backend/domain/repositories/AnswerRepository';
import { Question } from '@/backend/domain/entities/Question';
import { Tag } from '@/backend/domain/entities/Tag';
import { AlgoliaSyncUseCase } from '@/backend/application/usecases/search/AlgoliaSyncUseCase';

export interface UpdateQuestionDto {
  title: string;
  content: any;
  contentHTML: string;
  tags: Tag[];
}

export class UpdateQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private algoliaSyncUseCase: AlgoliaSyncUseCase,
    private answerRepository: AnswerRepository
  ) {}

  async execute(questionId: number, userId: string, dto: UpdateQuestionDto): Promise<Question> {
    // 질문 존재 여부 확인
    const existingQuestion = await this.questionRepository.findById(questionId);
    if (!existingQuestion) {
      throw new Error('질문을 찾을 수 없습니다.');
    }

    // 질문 작성자 확인
    if (existingQuestion.userId !== userId) {
      throw new Error('질문을 수정할 권한이 없습니다.');
    }

    // 답변 존재 여부 확인 (답변이 있으면 수정 불가)
    const hasAnswers = await this.questionRepository.hasAnswers(questionId);
    if (hasAnswers) {
      throw new Error('이미 답변이 작성되었으므로 수정이 불가능합니다.');
    }

    // 질문 수정
    const updatedQuestionEntity = new Question({
      id: questionId,
      title: dto.title,
      content: dto.content,
      contentHTML: dto.contentHTML,
      userId: existingQuestion.userId,
      createdAt: existingQuestion.createdAt,
      updatedAt: new Date(),
    });

    const result = await this.questionRepository.update(questionId, updatedQuestionEntity);

    // 태그 업데이트 (기존 태그 삭제 후 새 태그 추가)
    await this.questionRepository.updateTags(questionId, dto.tags);

    // Sync with Algolia, including answers
    if (this.algoliaSyncUseCase) {
      const answers = await this.answerRepository.findByQuestionId(questionId);
      // Fetch the full question again to get all updated relations for Algolia
      const fullQuestionForAlgolia = await this.questionRepository.findById(questionId);
      if (fullQuestionForAlgolia) {
        await this.algoliaSyncUseCase.updateQuestion(fullQuestionForAlgolia, answers);
      }
    }

    return result;
  }
}
