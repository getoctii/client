import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import queryClient from '../utils/queryClient'
import { Events } from '../utils/constants'
import { log } from '../utils/logging'
import { Auth } from '@/state/auth'
import { useHistory } from 'react-router-dom'
import { CommunityResponse } from '@/api/communities'

const useDeletedMember = (eventSource: EventSourcePolyfill | null) => {
  const { id, token } = Auth.useContainer()
  const history = useHistory()
  useEffect(() => {
    if (!eventSource) return
    const handler = (e: MessageEvent) => {
      const event = JSON.parse(e.data) as {
        id: string
        community_id: string
      }
      log('Events', 'purple', 'DELETED_MEMBER')
      queryClient.setQueryData(['communities', id, token], (initial) => {
        if (initial instanceof Array) {
          return initial.filter((m: any) => m.id !== event.id)
        } else return initial
      })

      history.push('/')
      const community = queryClient.getQueryData<CommunityResponse>([
        'community',
        event.community_id,
        token
      ])
      if (community?.channels) {
        community.channels.forEach((channelID) => {
          queryClient.removeQueries(['messages', channelID, token])
          queryClient.removeQueries(['channel', channelID, token])
        })
      }

      queryClient.removeQueries(['channels', event.community_id, token])
      queryClient.removeQueries(['community', event.community_id, token])
    }

    eventSource.addEventListener(Events.DELETED_MEMBER, handler)

    return () => {
      eventSource.removeEventListener(Events.DELETED_MEMBER, handler)
    }
  }, [eventSource, id, token, history])
}

export default useDeletedMember
