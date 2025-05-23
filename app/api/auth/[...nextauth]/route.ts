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
      profile(profile) {
        return {
          id: profile.id,
          email: profile.kakao_account?.email,
          name: profile.kakao_account?.profile?.nickname,
          image: profile.kakao_account?.profile?.thumbnail_image_url,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // 로그인 후 최초 jwt 콜백
      if (account && profile) {
        const email = profile.kakao_account?.email;

        // DB접근
        const dbUser = await prisma.users.findUnique({
          where: { email },
        });

        if (dbUser) {
          // 회원가입이 되어있는 사용자
          token.id = dbUser.id;
          token.email = email;
          token.name = dbUser.name;
          token.role = dbUser.member_type;
          token.birthyear = dbUser.birthyear;
          token.member_type = dbUser.member_type;
          // created_at추가 보류 => 타입 오류 발생 가능
          token.hpid = dbUser.hpid;
          token.needsSignup = false;
        } else {
          // 회원가입이 되어있지 않은 사용자 => 보류
          // 사용자 별 토큰에 정보 입력 : 일반 step1 | 약사 step2
          // 이후 사용자 정보는 토큰에 입력? 세션에 입력?

          token.needsSignup = true;
        }
        // 사용자 isActive 여부 판단 완료
      }

      return token;
    },

    async session({ session, token }) {
      // jwt에서 세션으로 값 전달
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.role = token.role as number;
      session.user.birthyear = token.birthyear as number;
      session.user.member_type = token.member_type as number;
      session.user.hpid = token.hpid as string;
      session.user.needsSignup = Boolean(token.needsSignup ?? false);
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
