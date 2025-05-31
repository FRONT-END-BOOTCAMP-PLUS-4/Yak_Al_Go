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
import { deletePost } from '@/lib/queries/deletePost';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { POSTS_QUERY_KEY } from '@/lib/constants/queryKeys';

interface PostOptionDropdownProps {
  postId?: number;
}

export function PostOptionDropdown({ postId }: PostOptionDropdownProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!postId) {
      alert('게시물 ID가 유효하지 않습니다.');
      return;
    }

    // 삭제 확인
    const isConfirmed = confirm('정말로 이 게시물을 삭제하시겠습니까?');
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      await deletePost(postId);
      alert('게시물이 성공적으로 삭제되었습니다.');

      // 게시물 목록 캐시 리셋
      await queryClient.resetQueries({ queryKey: POSTS_QUERY_KEY });

      router.push('/community');
    } catch (error: any) {
      alert(error.message || '게시물 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <MoreHorizontal className="h-3 w-3" />
          <span className="sr-only">게시물 옵션</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/member/posts/${postId}/edit`)}>
          <Edit className="h-3 w-3 mr-2" />
          수정
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleDelete} disabled={isDeleting}>
          <Trash2 className="h-3 w-3 mr-2" />
          {isDeleting ? '삭제 중...' : '삭제'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
