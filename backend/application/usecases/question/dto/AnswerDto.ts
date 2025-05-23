export interface AnswerResponseDto {
  id?: number;
  content: any;
  userId: string;
  questionId: number;
  role: string;
  likes: number;
  createdAt?: Date;
  updatedAt?: Date;
}
