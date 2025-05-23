import { QuestionResponseDto } from '@/backend/application/usecases/question/dto/QuestionDto';

export async function getQuestion(id: string): Promise<QuestionResponseDto> {
  const response = await fetch(`http://localhost:3000/api/questions/${id}`, {
    cache: 'no-store', // Disable caching, or use revalidate
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Question not found');
    }
    throw new Error('Failed to fetch question');
  }

  return response.json();
}
