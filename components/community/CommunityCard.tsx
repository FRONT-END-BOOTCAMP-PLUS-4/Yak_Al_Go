import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, User, Clock } from 'lucide-react';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
    tags: string[];
    answers: number;
  };
  isQna: boolean;
}

export function CommunityCard({ post, isQna }: PostCardProps) {
  const href = isQna ? `/qnas/${post.id}` : `/posts/${post.id}`;

  return (
    <Link href={href}>
      <Card className="py-0 h-full overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={isQna ? 'default' : 'outline'} className={isQna ? 'bg-primary' : ''}>
                  {isQna ? '전문가 Q&A' : '자유게시판'}
                </Badge>
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
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
                  {isQna ? '답변' : '댓글'} {post.answers}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
