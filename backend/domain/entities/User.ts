export interface User {
  id?: string;
  email?: string;
  photo?: string;
  name?: string;
  birthyear?: number;
  gender?: string;
  member_type?: number;
  hpid?: string;
  created_at?: Date;
  deleted_at?: Date;
}

export interface UserHealthCondition {
  pregnent?: number;       // 0없음 1임산부
  allergy?: number;        // 0없음 2알레르기
  hypertension?: number;   // 0없음 3고혈압
  diabetes?: number;       // 0없음 4당뇨
  heartDisease?: number;   // 0없음 5심장질환
  liverDisease?: number;   // 0없음 6간질환
  kidneyDisease?: number;  // 0없음 7신장질환
}