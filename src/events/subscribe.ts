import { useEffect, useState } from 'react'
import { Auth } from '../authentication/state'
import { CLIENT_GATEWAY_URL } from '../utils/constants'
import { AppState, Plugins } from '@capacitor/core'
import {
  getCommunities,
  getMentions,
  getParticipants,
  getUnreads
} from '../user/remote'
import { isPlatform } from '@ionic/react'
import queryClient from '../utils/queryClient'

const { App, BackgroundTask } = Plugins

const useSubscribe = () => {
  const { token, id } = Auth.useContainer()
  const [eventSource, setEventSource] = useState<EventSource | null>(null)
  useEffect(() => {
    if (!token) return
    let evtSource: EventSource | null

    const createEventSource = () => {
      const source = new EventSource(
        `${CLIENT_GATEWAY_URL}/events/subscribe/${id}?authorization=${token}`
      )

      evtSource = source

      setEventSource(source)

      queryClient.prefetchQuery(['communities', id, token], getCommunities)
      queryClient.prefetchQuery(['participants', id, token], getParticipants)
      queryClient.prefetchQuery(['unreads', id, token], getUnreads)
      queryClient.prefetchQuery(['mentions', id, token], getMentions)
    }

    const stateChangeCb = (state: AppState) => {
      if (!isPlatform('capacitor')) return
      if (!state.isActive) {
        const taskID = BackgroundTask.beforeExit(() => {
          evtSource?.close()
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
      evtSource?.close()
    }
  }, [token, id])

  return [eventSource]
}

export default useSubscribe
