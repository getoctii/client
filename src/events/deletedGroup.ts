import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import queryClient from '../utils/queryClient'
import { Events } from '../utils/constants'
import { log } from '../utils/logging'
import { Auth } from '../views/authentication/state'
import { MemberResponse } from '../views/community/remote'
import { MembersResponse } from '../user/remote'

const useDeletedGroup = (eventSource: EventSourcePolyfill | null) => {
  const { id, token } = Auth.useContainer()
  useEffect(() => {
    if (!eventSource) return
    const handler = async (e: MessageEvent) => {
      const event = JSON.parse(e.data) as {
        id: string
        community_id: string
      }
      log('Events', 'purple', 'DELETED_GROUP')
      queryClient.setQueryData<string[]>(
        ['groups', event.community_id, token],
        (initial) =>
          initial ? initial.filter((group) => group !== event.id) : []
      )
      const communities = queryClient.getQueryData<MembersResponse>([
        'communities',
        id,
        token
      ])
      const member = communities?.find(
        (m) => m.community.id === event.community_id
      )
      if (!!member?.id) {
        const memberGroups = queryClient.getQueryData<MemberResponse>([
          'member',
          member.id,
          token
        ])
        if (memberGroups?.groups?.some((g) => g === event.id)) {
          await queryClient.invalidateQueries(['member', member.id, token])
        }
      }
    }

    eventSource.addEventListener(Events.DELETED_GROUP, handler)

    return () => {
      eventSource?.removeEventListener(Events.DELETED_GROUP, handler)
    }
  }, [eventSource, id, token])
}

export default useDeletedGroup
