import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    isActive?: boolean;
    // 여기에 필요한 추가 사용자 속성 정의
  }

  interface Session {
    user: {
      id: string;
      isActive?: boolean;
      // 여기에 필요한 추가 사용자 속성 정의
    } & DefaultSession['user'];
  }

  interface JWT {
    isActive?: boolean;
    // 여기에 필요한 추가 토큰 속성 정의
  }
}
