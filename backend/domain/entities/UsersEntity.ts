
export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public photo: string,
    public birthyear: number,
    public member_type: number,
    public hpid: string
  ) {}
}