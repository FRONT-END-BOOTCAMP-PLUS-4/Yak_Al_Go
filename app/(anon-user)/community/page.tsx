'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Search, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useQuestions } from '@/lib/queries/useQuestions';

import { QuestionCard } from '@/components/community/QuestionCard';
import { PostCard } from '@/components/community/PostCard';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('qnas');

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data: qnas,
    fetchNextPage: fetchNextQnas,
    hasNextPage: hasNextQnas,
    isFetchingNextPage: isFetchingNextQnas,
  } = useQuestions();

  const questions = qnas?.pages.flatMap((page: any) => page?.questions || []) || [];
  const posts: any[] = [];
  const isLoading = isFetchingNextQnas;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextQnas && hasNextQnas) {
          fetchNextQnas();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [isFetchingNextQnas, fetchNextQnas, hasNextQnas]);

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6 overflow-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">커뮤니티</h1>
          <p className="text-muted-foreground">약에 관한 정보를 공유하고 소통하는 공간입니다.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row mx-1">
          <div className="flex w-full items-center space-x-2">
            <Input type="text" placeholder="검색어를 입력하세요" />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          <Button asChild>
            {activeTab === 'qnas' ? (
              <Link href="/member/qnas/write">질문하기</Link>
            ) : (
              <Link href="/member/posts/write">글쓰기</Link>
            )}
          </Button>
        </div>

        <Tabs defaultValue="qnas" className="w-full" onValueChange={(value) => setActiveTab(value)}>
          <TabsList>
            <TabsTrigger value="qnas">전문가 Q&A</TabsTrigger>
            <TabsTrigger value="posts">자유게시판</TabsTrigger>
          </TabsList>
          <TabsContent value="qnas" className="mt-4">
            <div className="grid gap-4">
              {questions.length > 0 ? (
                questions.map((qna) => <QuestionCard key={qna.id} qna={qna} />)
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground">질문이 없습니다.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="posts" className="mt-4">
            <div className="grid gap-4">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground">게시글이 없습니다.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <div className="flex justify-center py-4" ref={loadMoreRef}>
            {isLoading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
