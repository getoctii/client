import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { log } from '../utils/logging'
import queryClient from '../utils/queryClient'
import { Socket } from 'socket.io-client'

const useLog = (socket: Socket | null) => {
  useEffect(() => {
    if (!socket) return
    const handler = async (e: Error) => {
      log('Events', 'purple', 'Connection error: ' + e.message)
      await queryClient.invalidateQueries()
    }

    socket.io.on('error', handler)

    return () => {
      socket.io.off('error', handler)
    }
  }, [socket])

  useEffect(() => {
    if (!socket) return
    const handler = () => {
      log('Events', 'purple', 'Connected to socket')
    }

    socket.on('connect', handler)

    return () => {
      socket.off('connect', handler)
    }
  }, [socket])
}

export default useLog
