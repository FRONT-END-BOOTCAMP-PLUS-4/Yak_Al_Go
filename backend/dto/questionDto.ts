export interface CreateQuestionDto {
  title: string;
  content: any;
  userId: string;
  tags: string[];
}

export interface QuestionResponseDto {
  id?: number;
  title: string;
  content: any;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
}
