import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { queryCache } from 'react-query'
import { Events } from '../utils/constants'
import { Auth } from '../authentication/state'
import { log } from '../utils/logging'

const useReorderedGroups = (eventSource: EventSourcePolyfill | null) => {
  const { token, id } = Auth.useContainer()
  useEffect(() => {
    if (!eventSource) return
    const handler = async (e: MessageEvent) => {
      const event = JSON.parse(e.data) as {
        community_id: string
        order: string[]
      }
      console.log(event)
      log('Events', 'purple', 'REORDERED_GROUPS')
      queryCache.setQueryData(
        ['groups', event.community_id, token],
        event.order.reverse()
      )

      await queryCache.invalidateQueries(
        (query) =>
          query.queryKey[0] === 'memberGroups' &&
          event.order.some((s) => (query.queryKey[1] as string[]).includes(s))
      )
    }

    eventSource.addEventListener(Events.REORDERED_GROUPS, handler)

    return () => {
      eventSource.removeEventListener(Events.REORDERED_GROUPS, handler)
    }
  }, [eventSource, token, id])
}

export default useReorderedGroups