import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { Events } from '../utils/constants'
import { log } from '../utils/logging'
import { Auth } from '../views/authentication/state'
import { CommunityResponse } from '../views/community/remote'
import { MembersResponse } from '../user/remote'
import queryClient from '../utils/queryClient'

const useUpdatedCommunity = (eventSource: EventSourcePolyfill | null) => {
  const { id, token } = Auth.useContainer()

  useEffect(() => {
    if (!eventSource) return
    const handler = async (e: MessageEvent) => {
      const event = JSON.parse(e.data) as CommunityResponse
      log('Events', 'purple', 'UPDATED_COMMUNITY')
      queryClient.setQueryData<CommunityResponse>(
        ['community', event.id, token],
        (initial) => {
          if (initial) {
            return {
              ...initial,
              ...event
            }
          } else {
            return event
          }
        }
      )
      queryClient.setQueryData<MembersResponse>(
        ['communities', id, token],
        (initial) => {
          if (initial) {
            return initial.map((c) =>
              c.community.id === event.id
                ? {
                    ...c,
                    community: {
                      ...c.community,
                      id: event.id,
                      name: event.name,
                      icon: event.icon,
                      large: event.large
                    }
                  }
                : c
            )
          } else {
            return [
              {
                id: '',
                community: {
                  id: event.id,
                  name: event.name,
                  icon: event.icon,
                  large: event.large
                }
              }
            ]
          }
        }
      )
    }

    eventSource.addEventListener(Events.UPDATED_COMMUNITY, handler)

    return () => {
      eventSource.removeEventListener(Events.UPDATED_COMMUNITY, handler)
    }
  }, [eventSource, id, token])
}

export default useUpdatedCommunity
