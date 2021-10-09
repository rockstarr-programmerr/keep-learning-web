import { User } from '../user'

export declare interface LoginReq {
  email: string;
  password: string;
}

export declare interface LoginRes {
  access: string;
  refresh: string;
}

export declare interface TokenRefreshReq {
  refresh: string;
}

export declare interface TokenRefreshRes {
  access: string;
  refresh: string;
}

export declare interface RegisterTeacherReq {
  email: string;
  password: string;
  name?: string;
  phone_number?: string;
}

export declare interface RegisterTeacherRes {
  email: string;
  name: string;
  phone_number: string;
}

export declare interface MyInfoRes extends User {}
