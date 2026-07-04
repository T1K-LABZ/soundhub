export type UserRole = 'OWNER' | 'MANAGER' | 'STAFF' | 'VIEWER'

export type AuthStatus = 'AUTHENTICATED' | 'PASSWORD_CHANGE_REQUIRED'

export type PermissionModule = {
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
}

export type Permissions = Record<string, PermissionModule>

export type User = {
  id: string
  role: UserRole
  storeId: string
  storeName: string
  mustChangePassword: boolean
  permissions: Permissions
}

export type LoginCredentials = {
  email: string
  password: string
  storeId?: string
}

export type LoginResponseData = {
  status: AuthStatus
  accessToken: string
  refreshToken: string
  user: User
}

export type ApiResponse<T> = {
  success: boolean
  data: T
  message: string
  meta?: {
    timezone: string
    timezoneOffset: string
    serverTime: string
  }
}

export type TokenResponseData = {
  accessToken: string
  refreshToken: string
}
