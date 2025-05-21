"use client"

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";

export default function AuthCheckPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    const checkUserAndRedirect = async () => {
      if (!session) {
        router.push('/auth');
        return;
      }

      try {
        // 사용자가 이미 등록되어 있는지 API로 체크
        const response = await fetch('/api/user/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            providerId: session.userId,
            provider: session.provider 
          })
        });

        const data = await response.json();
        
        if (data.isRegistered) {
          // 이미 가입된 회원이면 메인 페이지로
          router.push('/');
        } else {
          // 카카오 정보 세션 스토리지에 저장
          sessionStorage.setItem('kakaoUserInfo', JSON.stringify({
            id: session.userId,
            email: session.user?.email,
            name: session.user?.name,
            image: session.user?.image
          }));
          
          // 신규 회원이면 추가 정보 입력 페이지로
          router.push('/auth/step1');
        }
      } catch (error) {
        console.error('사용자 체크 중 오류 발생:', error);
        router.push('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndRedirect();
  }, [session, status, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">인증 정보 확인 중...</p>
      </div>
    );
  }

  return null;