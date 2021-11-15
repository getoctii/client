import { useEffect, useState } from 'react'
import { Auth } from '../views/authentication/state'
import { CLIENT_GATEWAY_URL } from '../utils/constants'
import { AppState, Plugins } from '@capacitor/core'
import { isPlatform } from '@ionic/react'
import { io, Socket } from 'socket.io-client'

const { App, BackgroundTask } = Plugins

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
        }
      })

      socket = s
      setEventSocket(s)

      // queryClient.prefetchQuery(['communities', id, token], getCommunities)
      // queryClient.prefetchQuery(['unreads', id, token], getUnreads)
      // queryClient.prefetchQuery(['mentions', id, token], getMentions)
    }

    const stateChangeCb = (state: AppState) => {
      if (!isPlatform('capacitor')) return
      if (!state.isActive) {
        const taskID = BackgroundTask.beforeExit(() => {
          socket?.close()
          BackgroundTask.finish({ taskId: taskID })
        })
      } else {
        createEventSource()
      }
    }

    createEventSource()

    const listener = App.addListener('appStateChange', stateChangeCb)

    return () => {
      listener.remove()
      socket?.close()
    }
  }, [token, id])

  return [eventSocket]
}

export default useSubscribe
