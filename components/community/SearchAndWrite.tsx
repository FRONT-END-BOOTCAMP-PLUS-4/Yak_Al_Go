import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function SearchAndWrite() {
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
        <Link href="/community/write">글쓰기</Link>
      </Button>
    </div>
  );
}
