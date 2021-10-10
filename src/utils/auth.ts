const accessTokenKey = 'access-token'
const refreshTokenKey = 'refresh-token'

export function setAccessToken (token: string): void {
  localStorage.setItem(accessTokenKey, token)
}

export function setRefreshToken (token: string): void {
  localStorage.setItem(refreshTokenKey, token)
}

export function loadAccessToken (): string {
  return localStorage.getItem(accessTokenKey) || ''
}

export function loadRefreshToken (): string {
  return localStorage.getItem(refreshTokenKey) || ''
}

export function getAuthorizationHeaderValue (accessToken?: string): string {
  if (accessToken !== undefined) {
    return `Bearer ${accessToken}`
  } else {
    return `Bearer ${loadAccessToken()}`
  }
}

export function deleteAccessToken (): void {
  localStorage.removeItem(accessTokenKey)
}

export function deleteRefreshToken (): void {
  localStorage.removeItem(refreshTokenKey)
}
