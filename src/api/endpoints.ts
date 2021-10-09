export const endpoints = {
  users: {
    login: '/users/login/',
    tokenRefresh: '/users/token-refresh/',
    registerTeacher: '/users/register-teacher/'
  }
}

export function replacePk (endpoint: string, pk: number): string {
  return endpoint.replace('<pk>', pk.toString())
}
