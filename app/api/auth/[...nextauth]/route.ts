// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import KaKaoProvider from 'next-auth/providers/kakao';
import { NextAuthOptions } from 'next-auth';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
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
        token.email = profile.kakao_account?.email;
        token.name = profile.kakao_account?.profile?.nickname;
        token.photo = profile.kakao_account?.profile?.thumbnail_image_url;

        // DB접근
        const email = profile.kakao_account?.email;
        const dbUser = await prisma.users.findUnique({
          where: { email },
        });

        if (dbUser) {
          // 회원가입이 되어있는 사용자
          token.id = dbUser.id;
          token.birthyear = dbUser.birthyear;
          token.member_type = dbUser.member_type;
          // created_at추가 보류 => 타입 오류 발생 가능
          token.created_at = dbUser.created_at;
          token.hpid = dbUser.hpid;
          token.needsSignup = false;
        } else {
          // 회원가입이 되어있지 않은 사용자 => 보류
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
      session.user.photo = token.photo as string;
      session.user.name = token.name as string;
      session.user.birthyear = token.birthyear as number;
      session.user.member_type = token.member_type as number;
      session.user.created_at = token.created_at as Date;
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
    newUser: '/auth/signup-step',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
