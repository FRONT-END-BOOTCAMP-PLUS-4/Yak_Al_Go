// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth'
import KaKaoProvider from 'next-auth/providers/kakao'
import { NextAuthOptions } from 'next-auth'

const handler = NextAuth({
  providers: [
    KaKaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    // 필요한 경우 커스텀 페이지 설정
    signIn: '/auth/signup', // 회원가입 페이지
    // 추가 정보 입력 페이지 등을 지정할 수 있음
    // newUser: '/auth/complete-profile',
  },
});



export { handler as GET, handler as POST }

