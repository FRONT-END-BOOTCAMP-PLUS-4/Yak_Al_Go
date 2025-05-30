'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, User, MapPin, Search, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

const navigation = [
  { name: '홈', href: '/' },
  { name: '약 검색', href: '/medicines' },
  { name: '약국 찾기', href: '/map' },
  { name: '커뮤니티', href: '/community' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const name = session?.user?.name ?? '';
  const photo = session?.user?.photo ?? '';
  const isAuthenticated = !!session;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <SheetTitle className="sr-only">내비게이션 메뉴</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b px-2 py-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-lg text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    <Image src="/logo.png" alt="약알고" width={100} height={50} />
                  </Link>
                </div>
                <nav className="flex-1 overflow-auto py-4">
                  <ul className="grid gap-1 px-2">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
                            pathname === item.href
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name === '약 검색' && <Search className="h-4 w-4" />}
                          {item.name === '약국 찾기' && <MapPin className="h-4 w-4" />}
                          {item.name === '커뮤니티' && <MessageSquare className="h-4 w-4" />}
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="border-t p-4">
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                      <Button asChild variant="ghost" onClick={() => setIsOpen(false)}>
                        <Link href="/member">
                          <span className="flex items-center gap-2">
                            <img src={photo} alt="Profile" className="h-8 w-8 rounded-full" />
                            <span className="text-sm font-medium">{name}</span>
                          </span>
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => signOut()}>
                        로그아웃
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button asChild className="w-full">
                        <Link href="/auth" onClick={() => setIsOpen(false)}>
                          로그인/회원가입
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="약알고" width={100} height={50} />
          </Link>
        </div>
        <nav className="hidden lg:flex lg:gap-4 lg:items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pathname === item.href ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/member">
                  <span className="flex items-center gap-2">
                    <img src={photo} alt="Profile" className="h-8 w-8 rounded-full" />
                    <span className="text-sm font-medium">{name}</span>
                  </span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                로그아웃
              </Button>
            </div>
          ) : (
            <Button asChild variant="ghost">
              <Link href="/auth" className="flex items-center gap-2">
                <User className="h-6 w-6" />
                <span className="text-sm font-medium">로그인/회원가입</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
