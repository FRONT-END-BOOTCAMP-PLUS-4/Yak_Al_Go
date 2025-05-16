('');
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function SearchAndWrite({ isQna }: { isQna: boolean }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex w-full items-center space-x-2">
        <Input type="text" placeholder="검색어를 입력하세요" />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      <Button asChild>
        {isQna ? <Link href="/member-user/qnas/new">질문하기</Link> : <Link href="/member-user/posts/new">글쓰기</Link>}
      </Button>
    </div>
  );
}
