import Vue from 'vue'
import { endpoints } from './endpoints'
import {
  LoginReq, LoginRes,
  MyInfoRes,
  RegisterTeacherReq, RegisterTeacherRes, TokenRefreshReq, TokenRefreshRes
} from '@/interfaces/api/account'

export const account = {
  async registerTeacher (reqBody: RegisterTeacherReq): Promise<RegisterTeacherRes> {
    const res = await Vue.axios.post(endpoints.account.users.registerTeacher, reqBody)
    return res.data
  },

  async login (reqBody: LoginReq): Promise<LoginRes> {
    const res = await Vue.axios.post(endpoints.account.users.login, reqBody)
    return res.data
  },

  async tokenRefresh (reqBody: TokenRefreshReq): Promise<TokenRefreshRes> {
    const res = await Vue.axios.post(endpoints.account.users.tokenRefresh, reqBody)
    return res.data
  },

  async getMyInfo (): Promise<MyInfoRes> {
    const res = await Vue.axios.get(endpoints.account.me.myInfo)
    return res.data
  }
}
