import { apiClient } from '../../lib/axios'
import type {
  ApiResponse,
  LoginCredentials,
  LoginResponseData,
  TokenResponseData,
} from './auth.types'

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponseData> {
  const response = await apiClient.post<ApiResponse<LoginResponseData>>(
    '/auth/login',
    credentials,
  )
  return response.data.data
}

export async function refreshToken(
  refreshToken: string,
): Promise<TokenResponseData> {
  const response = await apiClient.post<ApiResponse<TokenResponseData>>(
    '/auth/refresh',
    { refreshToken },
  )
  return response.data.data
}

export async function changePassword(newPassword: string): Promise<void> {
  await apiClient.post('/auth/set-new-password', { newPassword })
}

export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', { refreshToken })
}
