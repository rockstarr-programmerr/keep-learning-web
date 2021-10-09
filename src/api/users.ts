import Vue from 'vue'
import { endpoints } from './endpoints'
import {
  LoginReq, LoginRes,
  RegisterTeacherReq, RegisterTeacherRes, TokenRefreshReq, TokenRefreshRes
} from '@/interfaces/api/user'

export const users = {
  async registerTeacher (reqBody: RegisterTeacherReq): Promise<RegisterTeacherRes> {
    const res = await Vue.axios.post(endpoints.users.registerTeacher, reqBody)
    return {
      name: res.data.name,
      email: res.data.email,
      phoneNumber: res.data.phone_number
    }
  },

  async login (reqBody: LoginReq): Promise<LoginRes> {
    const res = await Vue.axios.post(endpoints.users.login, reqBody)
    return {
      access: res.data.access,
      refresh: res.data.refresh
    }
  },

  async tokenRefresh (reqBody: TokenRefreshReq): Promise<TokenRefreshRes> {
    const res = await Vue.axios.post(endpoints.users.tokenRefresh, reqBody)
    return {
      access: res.data.access,
      refresh: res.data.refresh
    }
  },
}
