import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { providerId, provider } = body;

    // 여기서 DB에 해당 providerId와 provider로 등록된 사용자가 있는지 확인
    // 임시 예시 코드:
    const isRegistered = false; // 실제로는 DB 조회 결과에 따라 설정

    return NextResponse.json({ isRegistered });
  } catch (error) {
    console.error('사용자 확인 중 오류:', error);
    return NextResponse.json({ error: '사용자 확인 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
