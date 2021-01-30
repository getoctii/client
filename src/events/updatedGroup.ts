import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { Events, Permissions } from '../utils/constants'
import { queryCache } from 'react-query'
import { log } from '../utils/logging'
import { Auth } from '../authentication/state'
import { GroupResponse } from '../community/remote'

const useUpdatedGroup = (eventSource: EventSourcePolyfill | null) => {
  const { id, token } = Auth.useContainer()

  useEffect(() => {
    if (!eventSource) return
    const handler = async (e: MessageEvent) => {
      const event = JSON.parse(e.data) as {
        community_id: string
        id: string
        name: string
        color: string
        permissions: Permissions[]
      }
      log('Events', 'purple', 'UPDATED_GROUP')

      const initial: GroupResponse | undefined = queryCache.getQueryData([
        'group',
        event.id,
        token
      ])
      console.log(event.permissions)
      if (initial) {
        queryCache.setQueryData(['group', event.id, token], {
          ...event,
          name: event.name,
          color: event.color,
          permissions: event.permissions
        })
      }
      await queryCache.invalidateQueries(
        (query) => query.queryKey[0] === 'memberGroups'
      )
    }

    eventSource.addEventListener(Events.UPDATED_GROUP, handler)

    return () => {
      eventSource.removeEventListener(Events.UPDATED_GROUP, handler)
    }
  }, [eventSource, id, token])
}

export default useUpdatedGroup