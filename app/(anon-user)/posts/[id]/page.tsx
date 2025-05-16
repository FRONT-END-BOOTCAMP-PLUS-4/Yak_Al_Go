import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PostCard } from '@/components/community/PostCard';
import { CommentCard } from '@/components/community/CommentCard';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Comment {
  id: number;
  content: string;
  author: string;
  date: string;
  likes: number;
}

// Mock data for post detail
const mockPost = {
  id: 1,
  title: '건강한 생활습관 공유합니다',
  content: '저는 매일 아침 30분 운동을 하고 있습니다. 규칙적인 운동이 건강에 도움이 되는 것 같아요.',
  author: 'user1',
  date: '2024-03-20',
  tags: ['운동', '건강'],
  views: 150,
  totalComments: 2,
  comments: [
    {
      id: 1,
      content: '저도 아침 운동을 시작했는데 정말 좋더라고요!',
      author: 'user2',
      date: '2024-03-20',
      likes: 3,
    },
    {
      id: 2,
      content: '어떤 운동을 하시나요? 추천해주세요.',
      author: 'user3',
      date: '2024-03-21',
      likes: 1,
    },
  ] as Comment[],
};

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the post details based on the ID
  const post = mockPost;

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/community">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">자유 게시판</h1>
        </div>

        <PostCard post={post} />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">댓글 {post.comments.length}개</h2>
          {post.comments.map((comment: Comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">답변 작성</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="댓글을 작성해주세요." className="min-h-[150px]" />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>댓글 등록</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
