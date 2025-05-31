'use client';
// UI 컴포넌트들
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

// tag 관련 컴포넌트들
import { TagSelect } from '@/components/qna/TagSelect';
import { Tag } from '@/backend/domain/entities/Tag';

// 훅들
import { useRef, useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// editor 관련 데이터
import { initialValue } from '@/app/member/qnas/write/editorInitialValue';
import { SerializedEditorState } from 'lexical';
import { getEditorHtmlFromJSON } from '@/lib/community/getEditorHtmlFromJSON';

// 게시물 수정 함수
import { updatePost } from '@/lib/queries/updatePost';
import { getPost } from '@/lib/queries/getPost';

// 게시물 수정시 데이터 캐시 무효화
import { POSTS_QUERY_KEY } from '@/lib/constants/queryKeys';
import { useQueryClient } from '@tanstack/react-query';

// Editor 컴포넌트 SSR 비활성화
const Editor = dynamic(() => import('@/components/blocks/editor-y/editor').then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <div className="h-72 w-full animate-pulse rounded-lg bg-muted" />,
});

// 게시물 편집 페이지
export default function EditPage() {
  // 태그 선택 상태
  const [tags, setTags] = useState<Tag[]>([]);
  // 제목 입력 상태
  const title = useRef<HTMLInputElement>(null);
  // editor 상태
  const editorState = useRef<SerializedEditorState>(initialValue);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 라우터, 쿼리 클라이언트, 파라미터
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const postId = params.id as string;

  // 기존 게시물 데이터 로딩
  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await getPost(postId);

        // 폼에 기존 데이터 설정
        if (title.current) {
          title.current.value = post.title;
        }

        // 에디터 상태 설정
        if (post.content) {
          editorState.current = post.content;
        }

        // 태그 설정
        if (post.tags) {
          setTags(post.tags);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading post:', error);
        alert('게시물을 불러오는데 실패했습니다.');
        router.back();
      }
    };

    if (postId) {
      loadPost();
    }
  }, [postId, router]);

  // 게시물 수정 함수
  const handleSubmit = async (e: React.FormEvent) => {
    const htmlContent = getEditorHtmlFromJSON(editorState.current);

    // 폼 제출 방지
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 게시물 수정 요청
      const result = await updatePost(parseInt(postId), {
        title: title.current?.value || '',
        content: editorState.current,
        contentHTML: htmlContent,
        tags,
      });

      console.log('Post updated:', result);

      // 무한 쿼리 완전히 리셋하고 새로고침
      await queryClient.resetQueries({ queryKey: POSTS_QUERY_KEY });

      // 수정된 게시물 상세 페이지로 이동
      router.push(`/community/posts/${postId}`);
    } catch (error: any) {
      console.error('Error updating post:', error);
      alert(error.message || '게시물 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">게시물을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">게시물 수정</h1>
          <p className="text-muted-foreground">게시물 내용을 수정하세요. (댓글이 있어도 수정 가능합니다)</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    제목
                  </label>
                  <Input id="title" ref={title} placeholder="제목을 입력하세요" required />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">태그</label>
                  <TagSelect selectedTags={tags} onTagsChange={setTags} />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">내용</label>
                  <Suspense fallback={<div className="h-72 w-full animate-pulse rounded-lg bg-muted" />}>
                    <Editor
                      editorSerializedState={editorState.current}
                      onSerializedChange={(value) => (editorState.current = value)}
                    />
                  </Suspense>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '수정 중...' : '수정하기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
