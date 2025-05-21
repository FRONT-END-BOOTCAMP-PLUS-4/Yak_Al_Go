// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import KaKaoProvider from 'next-auth/providers/kakao';
import { NextAuthOptions } from 'next-auth';

const handler = NextAuth({
  providers: [
    KaKaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/auth',
  },
});

export { handler as GET, handler as POST };
