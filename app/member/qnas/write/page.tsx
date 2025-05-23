'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

import { useRef, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { TagSelect } from '@/components/qna/TagSelect';
import { initialValue } from '@/app/member/qnas/write/editorInitialValue';
import { SerializedEditorState } from 'lexical';

// Dynamically import the Editor component with no SSR
const Editor = dynamic(() => import('@/components/blocks/editor-x/editor').then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <div className="h-72 w-full animate-pulse rounded-lg bg-muted" />,
});

export default function WritePage() {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const title = useRef<HTMLInputElement>(null);
  const editorState = useRef<SerializedEditorState>(initialValue);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.current?.value,
          content: editorState.current,
          tags,
          userId: '20250522',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      const result = await response.json();
      console.log('Question created:', result);
      router.push('/community');
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">질문 작성</h1>
          <p className="text-muted-foreground">약에 관한 궁금한 점을 전문가에게 물어보세요.</p>
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
            <Button type="submit">작성하기</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
