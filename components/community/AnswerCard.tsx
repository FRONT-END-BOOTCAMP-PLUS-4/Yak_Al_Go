import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp } from 'lucide-react';

interface Answer {
  id: number;
  content: string;
  author: string;
  role: string;
  date: string;
  likes: number;
  isExpert: boolean;
}

interface AnswerCardProps {
  answer: Answer;
}

export function AnswerCard({ answer }: AnswerCardProps) {
  return (
    <Card>
      <CardContent className="p-4 py-0">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{answer.author}</span>
                {answer.isExpert && (
                  <Badge variant="default" className="bg-primary">
                    {answer.role}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">{answer.date}</div>
            </div>
            <p className="whitespace-pre-line text-lg">{answer.content}</p>
            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" size="sm" className="gap-1">
                <ThumbsUp className="h-4 w-4" />
                도움이 됐어요 {answer.likes}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
