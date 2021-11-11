import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { Events, Permissions } from '../utils/constants'
import { log } from '../utils/logging'
import { Auth } from '../authentication/state'
import { GroupResponse, MemberResponse } from '../community/remote'
import { MembersResponse } from '../user/remote'
import queryClient from '../utils/queryClient'

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

      const initial: GroupResponse | undefined = queryClient.getQueryData([
        'group',
        event.id,
        token
      ])
      if (initial) {
        queryClient.setQueryData(['group', event.id, token], {
          ...event,
          name: event.name,
          color: event.color,
          permissions: event.permissions
        })
      }
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

    eventSource.addEventListener(Events.UPDATED_GROUP, handler)

    return () => {
      eventSource.removeEventListener(Events.UPDATED_GROUP, handler)
    }
  }, [eventSource, id, token])
}

export default useUpdatedGroup
