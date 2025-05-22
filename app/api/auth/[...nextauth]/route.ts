// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import KaKaoProvider from 'next-auth/providers/kakao';
import { NextAuthOptions } from 'next-auth';
import prisma from '@/lib/prisma';

const handler = NextAuth({
  providers: [
    KaKaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // 로그인 후 최초 jwt 콜백
      if (account && profile) {
        // DB접근
        const dbUser = await prisma.users.findUnique({
          where: { email: profile.kakao_account.email },
        });
        if (dbUser) {
          // 회원가입이 되어있는 사용자
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.role = dbUser.member_type;
          token.hpid = dbUser.hpid;
        } else {
          // 회원가입이 되어있지 않은 사용자 => 보류
          // 사용자 별 토큰에 정보 입력 : 일반 step1 | 약사 step2
          // 이후 사용자 정보는 토큰에 입력? 세션에 입력?

          token.needsSignup = true;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // jwt에서 세션으로 값 전달
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.role = token.role;
      session.user.hpid = token.hpid;
      session.user.needsSignup = token.needsSignup ?? false;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth',
    newUser: '/auth/step1',
  },
});

export { handler as GET, handler as POST };
