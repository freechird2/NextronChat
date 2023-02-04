export interface RegistData {
  email: string;
  password: string;
  confirm: string;
  nickname: string;
}

export interface ValidRegistData {
  email: boolean;
  password: boolean;
  confirm: boolean;
  nickname: boolean;
}
