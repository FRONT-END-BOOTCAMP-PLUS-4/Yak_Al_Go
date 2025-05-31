import { SerializedEditorState } from 'lexical';
import { Tag } from '@/backend/domain/entities/Tag';

export interface UpdatePostRequest {
  title: string;
  content: SerializedEditorState;
  contentHTML: string;
  tags: Tag[];
}

export interface UpdatePostResponse {
  id: number;
  title: string;
  content: SerializedEditorState;
  contentHTML: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export const updatePost = async (id: number, data: UpdatePostRequest): Promise<UpdatePostResponse> => {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '게시물 수정에 실패했습니다.');
  }

  return response.json();
};
