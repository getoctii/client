import { useMemo, useEffect, useState } from 'react'
import decode from 'jwt-decode'
import { createContainer } from '@innatical/innstate'
import { clientGateway } from '@/utils/constants'
import { useSuspenseStorageItem } from '@/utils/storage'
import queryClient from '@/utils/queryClient'

const useAuth = () => {
  const [token, setToken] = useSuspenseStorageItem<string | null>(
    'neko-token',
    null
  )
  const [betaCode, setBetaCode] = useState<string | undefined>(undefined)

  const authenticated = !!token
  const payload = useMemo<{ sub: string; exp: number } | undefined>(
    () => (token ? (decode(token) as any) : null),
    [token]
  )

  useEffect(() => {
    if (payload?.exp && payload.exp <= Math.floor(Date.now() / 1000)) {
      localStorage.clear()
      queryClient.clear()
    }
  }, [payload, setToken])

  return {
    id: payload?.sub ?? null,
    authenticated,
    token: token || null,
    setToken,
    betaCode,
    setBetaCode
  }
}

export const Auth = createContainer(useAuth)
