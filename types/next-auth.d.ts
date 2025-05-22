import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Profile {
    kakao_account?: {
      email?: string;
      profile?: {
        nickname?: string;
        thumbnail_image_url?: string;
      };
    };
  }
  interface User {
    id: string;
    email?: string;
    name?: string;
    role?: number;
    hpid?: string;
    needsSignup?: boolean;
    birthyear?: number;
    member_type?: number;
  }

  interface Session {
    user: {
      id: string;
      email?: string;
      name?: string;
      role?: number;
      hpid?: string;
      needsSignup: boolean;
      birthyear?: number;
      member_type?: number;
    } & DefaultSession['user'];
  }
  interface JWT {
    id?: string;
    email?: string;
    name?: string;
    role?: number;
    hpid?: string;
    needsSignup?: boolean;
    birthyear?: number;
    member_type?: number;
  }
}
