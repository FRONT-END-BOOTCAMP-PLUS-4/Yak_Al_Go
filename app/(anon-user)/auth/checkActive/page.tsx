"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CheckActivePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // 세션 로딩 중에는 아무 작업도 하지 않음

    if (session?.user?.needsSignup) {
      // 회원가입이 필요한 경우
      router.push("/auth/step1");
    } else {
      // 회원가입이 필요 없는 경우
      router.push("/");
    }
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>회원 상태를 확인 중입니다...</p>
    </div>
  );
}