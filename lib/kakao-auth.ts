// 카카오 SDK 초기화에 필요한 상수
=
// 카카오 로그인 함수


// 카카오 토큰 검증 함수
export async function validateKakaoToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      "https://kapi.kakao.com/v1/user/access_token_info",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.ok;
  } catch (error) {
    console.error("토큰 검증 실패:", error);
    return false;
  }
}

// 카카오 사용자 정보 조회 함수
export async function getKakaoUserInfo(token: string) {
  try {
    const response = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    throw error;
  }
}
