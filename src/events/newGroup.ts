import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { queryCache } from 'react-query'
import { Events } from '../utils/constants'
import { Auth } from '../authentication/state'
import { log } from '../utils/logging'

const useNewGroup = (eventSource: EventSourcePolyfill | null) => {
  const { token, id } = Auth.useContainer()
  useEffect(() => {
    if (!eventSource) return
    const handler = async (e: MessageEvent) => {
      const event = JSON.parse(e.data) as {
        id: string
        community_id: string
      }
      log('Events', 'purple', 'NEW_GROUP')
      queryCache.setQueryData<string[]>(
        ['groups', event.community_id, token],
        (initial) => (initial ? [...initial, event.id] : [event.id])
      )
      await queryCache.invalidateQueries(
        (query) => query.queryKey[0] === 'memberGroups'
      )
    }

    eventSource.addEventListener(Events.NEW_GROUP, handler)

    return () => {
      eventSource.removeEventListener(Events.NEW_GROUP, handler)
    }
  }, [eventSource, token, id])
}

export default useNewGroup