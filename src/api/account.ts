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
    return {
      name: res.data.name,
      email: res.data.email,
      phoneNumber: res.data.phone_number
    }
  },

  async login (reqBody: LoginReq): Promise<LoginRes> {
    const res = await Vue.axios.post(endpoints.account.users.login, reqBody)
    return {
      access: res.data.access,
      refresh: res.data.refresh
    }
  },

  async tokenRefresh (reqBody: TokenRefreshReq): Promise<TokenRefreshRes> {
    const res = await Vue.axios.post(endpoints.account.users.tokenRefresh, reqBody)
    return {
      access: res.data.access,
      refresh: res.data.refresh
    }
  },

  async getMyInfo (): Promise<MyInfoRes> {
    const res = await Vue.axios.get(endpoints.account.me.myInfo)
    return {
      pk: res.data.pk,
      url: res.data.url,
      name: res.data.name,
      email: res.data.email,
      phoneNumber: res.data.phone_number,
      userType: res.data.user_type,
      avatar: res.data.avatar,
      avatarThumbnail: res.data.avatar_thumbnail
    }
  }
}
