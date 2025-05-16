import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThumbsUp } from 'lucide-react';

interface Comment {
  id: number;
  content: string;
  author: string;
  date: string;
  likes: number;
}

interface CommentCardProps {
  comment: Comment;
}

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.author}</span>
              </div>
              <div className="text-sm text-muted-foreground">{comment.date}</div>
            </div>
            <p className="whitespace-pre-line text-lg">{comment.content}</p>
            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" size="sm" className="gap-1">
                <ThumbsUp className="h-4 w-4" />
                도움이 됐어요 {comment.likes}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
