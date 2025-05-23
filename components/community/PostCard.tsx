import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, User, Clock } from 'lucide-react';
import { formatDate } from '@/lib/community/formatDate';
import { getContentText } from '@/lib/community/getContentText';
import { useMemo } from 'react';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: any;
    tags?: string[];
    userId: string;
    createdAt: string;
    commentCount: number;
  };
}

export const PostCard = ({ post }: PostCardProps) => {
  const contentText = useMemo(() => getContentText(post.content), [post.content]);

  return (
    <Link href={`community/posts/${post.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">자유게시판</Badge>
                <div className="flex flex-wrap gap-1">
                  {post.tags &&
                    post.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
              <h3 className="font-bold text-lg">{post.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{contentText}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {post.userId}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(post.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  댓글 {post.commentCount}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
