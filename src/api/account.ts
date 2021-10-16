import Vue from 'vue'
import { endpoints, replacePk } from './endpoints'
import {
  LoginReq, LoginRes,
  MyInfoRes,
  RegisterTeacherReq, RegisterTeacherRes, TokenRefreshReq, TokenRefreshRes, UpdateProfileReq, UpdateProfileRes, UserDetailRes
} from '@/interfaces/api/account'
import { User } from '@/interfaces/user'

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
  },

  async userDetail (pk: User['pk']): Promise<UserDetailRes> {
    const endpoint = replacePk(endpoints.account.users.detail, pk)
    const res = await Vue.axios.get(endpoint)
    return res.data
  },

  async updateProfile (payload: UpdateProfileReq): Promise<UpdateProfileRes> {
    const res = await Vue.axios.patch(endpoints.account.me.updateProfile, payload)
    return res.data
  }
}
