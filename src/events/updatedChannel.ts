import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { ChannelTypes, Events } from '../utils/constants'

import { log } from '../utils/logging'
import { Auth } from '../views/authentication/state'
import { ChannelResponse } from '../views/community/remote'
import queryClient from '../utils/queryClient'

const useUpdatedChannel = (eventSource: EventSourcePolyfill | null) => {
  const { id, token } = Auth.useContainer()

  useEffect(() => {
    if (!eventSource) return
    const handler = async (e: MessageEvent) => {
      const event = JSON.parse(e.data) as {
        id: string
        name: string
        description: string
        color: string
        order: number
        type: ChannelTypes
        parent_id: string
        community_id: string
        voice_users?: string[]
      }
      log('Events', 'purple', 'UPDATED_CHANNEL')
      queryClient.setQueryData<ChannelResponse>(
        ['channel', event.id, token],
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
      queryClient.setQueryData<ChannelResponse[]>(
        ['channels', event.community_id, token],
        (initial) => {
          if (initial) {
            return initial.map((c) =>
              c.id === event.id
                ? {
                    ...c,
                    ...event
                  }
                : c
            )
          } else {
            return [
              {
                ...event
              }
            ]
          }
        }
      )
    }

    eventSource.addEventListener(Events.UPDATED_CHANNEL, handler)

    return () => {
      eventSource.removeEventListener(Events.UPDATED_CHANNEL, handler)
    }
  }, [eventSource, id, token])
}

export default useUpdatedChannel
