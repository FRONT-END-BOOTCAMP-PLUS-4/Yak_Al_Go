'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, User, Clock, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useQuestions } from '@/lib/queries/useQuestions';
import { formatDate } from '@/lib/community/formatDate';
import { getContentText } from '@/lib/community/getContentText';

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
                questions.map((qna) => (
                  <Link href={`community/qnas/${qna.id}`} key={qna.id}>
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="default" className="bg-primary">
                                전문가 Q&A
                              </Badge>
                              <div className="flex flex-wrap gap-1">
                                {qna.tags &&
                                  qna.tags.map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                            <h3 className="font-bold text-lg">{qna.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {getContentText(qna.content)}
                            </p>
                            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {qna.userId}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(qna.createdAt)}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                답변 {qna.answerCount}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground">질문이 없습니다.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="posts" className="mt-4">
            <div className="grid gap-4">
              {posts.map((post, index) => (
                <Link href={`community/posts/${post.id}`} key={post.id}>
                  <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">자유게시판</Badge>
                            <div className="flex flex-wrap gap-1">
                              {post.tags.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <h3 className="font-bold text-lg">{post.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{post.content}</p>
                          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {post.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              댓글 {post.answers}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
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
