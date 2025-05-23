import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, User, Clock } from 'lucide-react';
import { formatDate } from '@/lib/community/formatDate';
import { getContentText } from '@/lib/community/getContentText';
import { useMemo } from 'react';
import { Tag } from '@/backend/domain/entities/tagEntity';

interface QuestionCardProps {
  qna: {
    id: string;
    title: string;
    content: any;
    tags?: Tag[];
    userId: string;
    createdAt: string;
    answerCount: number;
  };
}

export const QuestionCard = ({ qna }: QuestionCardProps) => {
  const contentText = useMemo(() => getContentText(qna.content), [qna.content]);

  return (
    <Link href={`community/qnas/${qna.id}`}>
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
                    qna.tags.map((tag: Tag) => (
                      <Badge key={tag.id} variant="outline" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                </div>
              </div>
              <h3 className="font-bold text-lg">{qna.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{contentText}</p>
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
  );
};
