'use client';

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, User, MapPin, Search, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLoadingContext } from '@/providers/LoadingProvider';

interface HeaderClientProps {
  navigation: Array<{
    name: string;
    href: string;
    loadingText: string;
  }>;
  isAuthenticated: boolean;
  name: string;
  photo: string;
}

export function HeaderClient({ navigation, isAuthenticated, name, photo }: HeaderClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { navigate } = useLoadingContext();

  const handleNavigation = (href: string, loadingText: string) => {
    setIsOpen(false);
    if (pathname !== href) {
      navigate(href, loadingText);
    }
  };

  return (
    <>
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
                <button
                  onClick={() => handleNavigation('/', '홈으로 이동하고 있어요...')}
                  className="flex items-center gap-2 font-bold text-lg text-primary"
                >
                  <Image src="/logo.png" alt="약알고" width={100} height={50} />
                </button>
              </div>
              <nav className="flex-1 overflow-auto py-4">
                <ul className="grid gap-1 px-2">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => handleNavigation(item.href, item.loadingText)}
                        className={cn(
                          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium w-full text-left',
                          pathname === item.href
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        )}
                      >
                        {item.name === '약 검색' && <Search className="h-4 w-4" />}
                        {item.name === '약국 찾기' && <MapPin className="h-4 w-4" />}
                        {item.name === '커뮤니티' && <MessageSquare className="h-4 w-4" />}
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-t p-4">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleNavigation('/member', '마이페이지로 이동하고 있어요...')}
                      className="w-full justify-start"
                    >
                      <span className="flex items-center gap-2">
                        <img src={photo} alt="Profile" className="h-8 w-8 rounded-full" />
                        <span className="text-sm font-medium">{name}</span>
                      </span>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => signOut()}>
                      로그아웃
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button 
                      className="w-full"
                      onClick={() => handleNavigation('/auth', '로그인 페이지로 이동하고 있어요...')}
                    >
                      로그인/회원가입
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <button
          onClick={() => handleNavigation('/', '홈으로 이동하고 있어요...')}
          className="flex items-center gap-2"
        >
          <Image src="/logo.png" alt="약알고" width={100} height={50} />
        </button>
      </div>
      <nav className="hidden lg:flex lg:gap-4 lg:items-center">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.href, item.loadingText)}
            className={cn(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname === item.href ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            {item.name}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost"
              onClick={() => handleNavigation('/member', '마이페이지로 이동하고 있어요...')}
            >
              <span className="flex items-center gap-2">
                <img src={photo} alt="Profile" className="h-8 w-8 rounded-full" />
                <span className="text-sm font-medium">{name}</span>
              </span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              로그아웃
            </Button>
          </div>
        ) : (
          <Button 
            variant="ghost"
            onClick={() => handleNavigation('/auth', '로그인 페이지로 이동하고 있어요...')}
            className="flex items-center gap-2"
          >
            <User className="h-6 w-6" />
            <span className="text-sm font-medium">로그인/회원가입</span>
          </Button>
        )}
      </div>
    </>
  );
}
