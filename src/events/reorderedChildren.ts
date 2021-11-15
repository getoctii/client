import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import queryClient from '../utils/queryClient'
import { Events } from '../utils/constants'
import { Auth } from '../views/authentication/state'
import { log } from '../utils/logging'

const useReorderedChildren = (eventSource: EventSourcePolyfill | null) => {
  const { token, id } = Auth.useContainer()
  useEffect(() => {
    if (!eventSource || !token) return
    const handler = async (e: MessageEvent) => {
      const event = JSON.parse(e.data) as {
        id: string
        community_id: string
        order: string[]
      }
      log('Events', 'purple', 'REORDERED_CHILDREN')
      await queryClient.invalidateQueries([
        'channels',
        event.community_id,
        token
      ])
    }

    eventSource.addEventListener(Events.REORDERED_CHILDREN, handler)

    return () => {
      eventSource.removeEventListener(Events.REORDERED_CHILDREN, handler)
    }
  }, [eventSource, token, id])
}

export default useReorderedChildren
