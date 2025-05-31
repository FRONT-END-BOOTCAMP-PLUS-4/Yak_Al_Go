export class UserHealth {
  constructor(
    public userId: string,
    public healthId: number // 0이 아닌 값만 저장
  ) {}
}