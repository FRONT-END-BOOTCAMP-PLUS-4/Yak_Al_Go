'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Edit, Trash2 } from 'lucide-react';
import { deleteQuestion } from '@/lib/queries/deleteQuestion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUESTIONS_QUERY_KEY } from '@/lib/constants/queryKeys';

interface QuestionOptionDropdownProps {
  questionId?: number;
  answerCount?: number;
}

export function QuestionOptionDropdown({ questionId, answerCount = 0 }: QuestionOptionDropdownProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!questionId) {
      alert('질문 ID가 유효하지 않습니다.');
      return;
    }

    // 답변이 있는지 확인
    if (answerCount > 0) {
      alert('이미 답변이 작성되었으므로 삭제가 불가능합니다.');
      return;
    }

    // 삭제 확인
    const isConfirmed = confirm('정말로 이 질문을 삭제하시겠습니까?');
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      await deleteQuestion(questionId);
      alert('질문이 성공적으로 삭제되었습니다.');

      // 질문 목록 캐시 리셋
      await queryClient.resetQueries({ queryKey: QUESTIONS_QUERY_KEY });

      router.push('/community');
    } catch (error: any) {
      alert(error.message || '질문 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">질문 옵션</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/member/qnas/${questionId}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          수정
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleDelete} disabled={isDeleting}>
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? '삭제 중...' : '삭제'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
