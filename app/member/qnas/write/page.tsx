'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { initialValue } from '@/app/member/qnas/write/editorInitialValue';
import { SerializedEditorState } from 'lexical';

import { Editor } from '@/components/blocks/editor-x/editor';

export default function WritePage() {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const title = useRef<HTMLInputElement>(null);
  const editorState = useRef<SerializedEditorState>(initialValue);

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: editorState.current,
          userId: '20250522',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      const result = await response.json();
      console.log('Question created:', result);
      router.push('/community'); // 나중에 질문 상세페이지로 이동 하도록 해야한다.
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
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onCompositionStart={() => setIsComposing(true)}
                      onCompositionEnd={() => setIsComposing(false)}
                      placeholder="태그를 입력하세요"
                    />
                    <Button type="button" onClick={handleAddTag}>
                      추가
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">내용</label>
                  <Editor
                    editorSerializedState={editorState.current}
                    onSerializedChange={(value) => (editorState.current = value)}
                  />
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
