import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, User, Clock, Eye } from 'lucide-react';

interface QnaCardProps {
  qna: {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
    tags: string[];
    views: number;
    type: string;
    totalAnswers: number;
  };
}

export function QnaCard({ qna }: QnaCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-primary">
              전문가 Q&A
            </Badge>
            <div className="flex flex-wrap gap-1">
              {qna.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold">{qna.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {qna.author}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {qna.date}
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                답변 {qna.totalAnswers}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-700 whitespace-pre-wrap text-lg">{qna.content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
