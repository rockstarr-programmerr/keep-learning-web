import Vue from 'vue'
import { endpoints, replacePk } from './endpoints'
import {
  ChangePasswordReq,
  EmailResetPasswordLinkReq,
  LoginReq, LoginRes,
  MyInfoRes,
  RegisterTeacherReq, RegisterTeacherRes, ResetPasswordReq, TokenRefreshReq, TokenRefreshRes, UpdateProfileReq, UpdateProfileRes, UserDetailRes
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
    let formData: FormData | UpdateProfileReq
    let contentType: string

    if (payload.avatar !== null) {
      formData = new FormData()
      Object.entries(payload).forEach(([key, value]) => {
        (formData as FormData).append(key, value)
      })
      contentType = 'multipart/formdata'
    } else {
      formData = payload
      contentType = 'application/json'
    }

    const res = await Vue.axios.patch(endpoints.account.me.updateProfile, formData, {
      headers: {
        'Content-Type': contentType
      }
    })
    return res.data
  },

  async changePassword (payload: ChangePasswordReq): Promise<void> {
    await Vue.axios.post(endpoints.account.users.changePassword, payload)
  },

  async emailResetPasswordLink (payload: EmailResetPasswordLinkReq): Promise<void> {
    await Vue.axios.post(endpoints.account.users.emailResetPasswordLink, payload)
  },

  async resetPassword (payload: ResetPasswordReq): Promise<void> {
    await Vue.axios.post(endpoints.account.users.resetPassword, payload)
  }
}
