import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
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
    name?: string;
    role?: number;
    hpid?: string;
    needsSignup?: boolean;
    birthyear?: number;
    member_type?: number;
  }
}
