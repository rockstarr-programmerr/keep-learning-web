export const endpoints = {
  account: {
    users: {
      login: '/account/users/login/',
      tokenRefresh: '/account/users/token-refresh/',
      registerTeacher: '/account/users/register-teacher/'
    },
    me: {
      myInfo: '/account/me/'
    }
  }
}

export function replacePk (endpoint: string, pk: number): string {
  return endpoint.replace('<pk>', pk.toString())
}
