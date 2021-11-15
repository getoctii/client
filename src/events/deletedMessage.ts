import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import queryClient from '../utils/queryClient'
import { Events } from '../utils/constants'
import { log } from '../utils/logging'
import { Auth } from '../views/authentication/state'
import { Mentions, Unreads } from '../user/remote'

interface Message {
  id: string
  channel_id: string
  author: {
    id: string
    username: string
    avatar: string
    discriminator: number
  }
  created_at: string
  updated_at: string
  content: string
  community_id?: string
  community_name?: string
  channel_name?: string
}

const useDeletedMessage = (eventSource: EventSourcePolyfill | null) => {
  const { id, token } = Auth.useContainer()
  useEffect(() => {
    if (!eventSource) return
    const handler = (e: MessageEvent) => {
      const event = JSON.parse(e.data) as Message
      log('Events', 'purple', 'DELETED_MESSAGE')
      const initial = queryClient.getQueryData([
        'messages',
        event.channel_id,
        token
      ])

      if (initial instanceof Array) {
        queryClient.setQueryData(
          ['messages', event.channel_id, token],
          initial.map((sub) =>
            sub.filter((msg: Message) => msg.id !== event.id)
          )
        )
      }

      const initialMentions: Mentions | undefined = queryClient.getQueryData([
        'mentions',
        id,
        token
      ])

      if (initialMentions) {
        queryClient.setQueryData(
          ['mentions', id, token],
          Object.fromEntries(
            Object.entries(initialMentions).map(([channel, mentions]) => [
              channel,
              mentions?.filter((mention) => mention.message_id !== event.id) ||
                []
            ])
          )
        )
      }

      const initialUnreads: Unreads | undefined = queryClient.getQueryData([
        'unreads',
        id,
        token
      ])

      if (initialUnreads) {
        queryClient.setQueryData(
          ['unreads', id, token],
          Object.fromEntries(
            Object.entries(initialUnreads).filter(
              ([_, unreads]) => unreads.last_message_id !== event.id
            )
          )
        )
      }
    }

    eventSource.addEventListener(Events.DELETED_MESSAGE, handler)

    return () => {
      eventSource.removeEventListener(Events.DELETED_MESSAGE, handler)
    }
  }, [eventSource, id, token])
}

export default useDeletedMessage
