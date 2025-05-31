import { SerializedEditorState } from 'lexical';
import { Tag } from '@/backend/domain/entities/Tag';

export interface UpdateQuestionRequest {
  title: string;
  content: SerializedEditorState;
  contentHTML: string;
  tags: Tag[];
}

export interface UpdateQuestionResponse {
  id: number;
  title: string;
  content: SerializedEditorState;
  contentHTML: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export const updateQuestion = async (id: number, data: UpdateQuestionRequest): Promise<UpdateQuestionResponse> => {
  const response = await fetch(`/api/questions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '질문 수정에 실패했습니다.');
  }

  return response.json();
};
