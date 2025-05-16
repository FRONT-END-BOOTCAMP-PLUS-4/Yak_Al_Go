import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { QnaCard } from '@/components/community/QnaCard';
import { AnswerCard } from '@/components/community/AnswerCard';

// Mock data for question detail
const expertQuestion = {
  id: 1,
  title: '타이레놀과 아스피린을 함께 복용해도 될까요?',
  content:
    '두통이 심해서 타이레놀과 아스피린을 함께 복용해도 괜찮을지 궁금합니다. 평소에 타이레놀을 복용하고 있는데, 오늘은 두통이 더 심해서 아스피린도 함께 복용하고 싶습니다. 부작용이나 주의사항이 있을까요?',
  author: 'user1',
  date: '2023-05-10',
  tags: ['진통제', '복용법'],
  views: 120,
  type: 'expert',
  answers: [
    {
      id: 1,
      content:
        '타이레놀(아세트아미노펜)과 아스피린은 작용 기전이 다른 약물이지만, 함께 복용 시 위장 장애 위험이 증가할 수 있습니다. 특히 아스피린은 위장 점막을 자극할 수 있어 주의가 필요합니다. 가능하면 의사나 약사와 상담 후 복용하시는 것이 좋습니다.',
      author: '건강약국',
      role: '약사',
      date: '2023-05-10',
      likes: 15,
      isExpert: true,
    },
    {
      id: 2,
      content:
        '두 약을 함께 복용하는 것보다 한 가지 약물로 충분한 용량을 복용하는 것이 더 안전합니다. 타이레놀만으로 통증이 조절되지 않는다면 의사와 상담하여 다른 진통제를 처방받는 것이 좋습니다.',
      author: '행복약국',
      role: '약사',
      date: '2023-05-11',
      likes: 8,
      isExpert: true,
    },
  ],
};

export default async function QuestionDetailPage({ params }: { params: { id: string } }) {
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
          <h1 className="text-2xl font-bold">전문가 Q&A</h1>
        </div>

        <QnaCard
          qna={{
            id: expertQuestion.id,
            title: expertQuestion.title,
            content: expertQuestion.content,
            author: expertQuestion.author,
            date: expertQuestion.date,
            tags: expertQuestion.tags,
            views: expertQuestion.views,
            type: expertQuestion.type,
            totalAnswers: expertQuestion.answers.length,
          }}
        />

        {/* Expert Q&A - Show answers */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">답변 {expertQuestion.answers.length}개</h2>
          {expertQuestion.answers.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} />
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">답변 작성</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="약사만 답변을 작성할 수 있습니다." className="min-h-[150px]" />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>답변 등록</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
