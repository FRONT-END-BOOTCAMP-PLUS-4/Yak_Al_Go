import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function QuestionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-6 w-12" /> {/* Q&A 배지 */}
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-12" /> {/* 태그 1 */}
            <Skeleton className="h-5 w-16" /> {/* 태그 2 */}
          </div>
        </div>
        <Skeleton className="h-7 w-4/5" /> {/* 제목 */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3" /> {/* User 아이콘 */}
            <Skeleton className="h-4 w-16" /> {/* 사용자명 */}
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3" /> {/* Clock 아이콘 */}
            <Skeleton className="h-4 w-20" /> {/* 날짜 */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" /> {/* 내용 첫 번째 줄 */}
          <Skeleton className="h-4 w-full" /> {/* 내용 두 번째 줄 */}
          <Skeleton className="h-4 w-3/4" /> {/* 내용 세 번째 줄 */}
          <Skeleton className="h-4 w-2/3" /> {/* 내용 네 번째 줄 */}
        </div>
      </CardContent>
    </Card>
  );
}

function AnswerSectionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16" /> {/* 약사 답변 배지 */}
            <Skeleton className="h-7 w-20" /> {/* 답변 작성 제목 */}
          </div>
          <Skeleton className="h-9 w-20" /> {/* 답변하기 버튼 */}
        </div>
      </CardHeader>
    </Card>
  );
}

function AnswerSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20" /> {/* 작성자명 */}
                <Skeleton className="h-6 w-12" /> {/* 약사 배지 */}
              </div>
              <Skeleton className="h-4 w-20" /> {/* 날짜 */}
            </div>
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-full" /> {/* 답변 내용 첫 번째 줄 */}
              <Skeleton className="h-4 w-full" /> {/* 답변 내용 두 번째 줄 */}
              <Skeleton className="h-4 w-4/5" /> {/* 답변 내용 세 번째 줄 */}
              <Skeleton className="h-4 w-3/4" /> {/* 답변 내용 네 번째 줄 */}
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" /> {/* 도움이 됐어요 버튼 */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        {/* 헤더 섹션 */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" /> {/* 뒤로가기 버튼 */}
          <Skeleton className="h-8 w-16" /> {/* Q&A 제목 */}
        </div>

        {/* 질문 카드 */}
        <QuestionSkeleton />

        {/* 답변 작성 섹션 */}
        <AnswerSectionSkeleton />

        {/* 답변 목록 */}
        <div className="space-y-4">
          <Skeleton className="h-7 w-24" /> {/* "답변 N개" 제목 */}
          <AnswerSkeleton />
          <AnswerSkeleton />
        </div>
      </div>
    </div>
  );
}
