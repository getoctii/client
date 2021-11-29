import { useEffect, useState } from 'react'
import { Auth } from '@/state/auth'
import { CLIENT_GATEWAY_URL } from '../utils/constants'
import { io, Socket } from 'socket.io-client'

const useSubscribe = () => {
  const { token, id } = Auth.useContainer()
  const [eventSocket, setEventSocket] = useState<Socket | null>(null)
  useEffect(() => {
    if (!token) return
    let socket: Socket | null

    const createEventSource = () => {
      const s = io(CLIENT_GATEWAY_URL, {
        auth: {
          token
        },
        path: '/gateway'
      })

      socket = s
      setEventSocket(s)

      // queryClient.prefetchQuery(['communities', id, token], getCommunities)
      // queryClient.prefetchQuery(['unreads', id, token], getUnreads)
      // queryClient.prefetchQuery(['mentions', id, token], getMentions)
    }

    createEventSource()

    return () => {
      socket?.close()
    }
  }, [token, id])

  return [eventSocket]
}

export default useSubscribe
