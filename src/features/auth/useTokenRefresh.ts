import { useEffect } from 'react'
import { refreshToken } from './auth.api'
import { useAuthStore } from './auth.store'

function decodeJwt(token: string): { exp?: number } | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function useTokenRefresh() {
  const token = useAuthStore((s) => s.accessToken)
  const refresh = useAuthStore((s) => s.refreshToken)
  const setTokens = useAuthStore((s) => s.setTokens)

  useEffect(() => {
    if (!token || !refresh) return

    let timeout: ReturnType<typeof setTimeout>
    let interval: ReturnType<typeof setInterval>

    function scheduleRefresh() {
      const decoded = decodeJwt(token)
      if (decoded?.exp) {
        const expiresMs = decoded.exp * 1000
        const nowMs = Date.now()
        const twoMin = 2 * 60 * 1000
        const delay = expiresMs - nowMs - twoMin
        if (delay > 0) {
          timeout = setTimeout(doRefresh, delay)
          return
        }
      }
      // Fallback: refresh every 10 minutes
      interval = setInterval(doRefresh, 10 * 60 * 1000)
    }

    async function doRefresh() {
      try {
        const currentRefresh = useAuthStore.getState().refreshToken
        if (!currentRefresh) return
        const { accessToken, refreshToken: newRefresh } =
          await refreshToken(currentRefresh)
        setTokens(accessToken, newRefresh)
      } catch {
        // Refresh failed — silently continue, 401 interceptor will handle
      }
    }

    scheduleRefresh()

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [token, refresh, setTokens])
}
