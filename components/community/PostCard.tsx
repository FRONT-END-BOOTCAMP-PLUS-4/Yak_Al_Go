import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Clock, Eye, MessageSquare } from 'lucide-react';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
    tags: string[];
    views: number;
    totalComments: number;
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-primary">
              커뮤니티
            </Badge>
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                조회 {post.views}
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                댓글 {post.totalComments}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-700 whitespace-pre-wrap text-lg">{post.content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
