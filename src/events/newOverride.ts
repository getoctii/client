import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import queryClient from '../utils/queryClient'
import { ChannelPermissions, ChannelTypes, Events } from '../utils/constants'
import { Auth } from '../views/authentication/state'
import { log } from '../utils/logging'
import { ChannelResponse } from '../views/chat/remote'

const useNewOverride = (eventSource: EventSourcePolyfill | null) => {
  const { token, id } = Auth.useContainer()
  useEffect(() => {
    if (!eventSource) return
    const handler = async (e: MessageEvent) => {
      const event = JSON.parse(e.data) as {
        channel_id: string
        group_id: string
        allow: ChannelPermissions[]
        deny: ChannelPermissions[]
      }
      log('Events', 'purple', 'NEW_OVERRIDE')

      queryClient.setQueryData<ChannelResponse>(
        ['channel', event.channel_id, token],
        (initial) => {
          if (initial) {
            return {
              ...initial,
              overrides: {
                ...initial.overrides,
                [event.group_id]: {
                  allow: event.allow,
                  deny: event.deny
                }
              }
            }
          } else {
            return {
              id: event.channel_id,
              name: '',
              type: ChannelTypes.CUSTOM,
              order: 0
            }
          }
        }
      )
    }

    eventSource.addEventListener(Events.NEW_OVERRIDE, handler)

    return () => {
      eventSource.removeEventListener(Events.NEW_OVERRIDE, handler)
    }
  }, [eventSource, token, id])
}

export default useNewOverride
