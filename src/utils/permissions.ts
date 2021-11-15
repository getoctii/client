import { useQuery } from 'react-query'
import {
  getCommunity,
  getGroups,
  getMember,
  GroupResponse
} from '../views/community/remote'
import { Auth } from '../views/authentication/state'
import { useCallback, useMemo } from 'react'
import { ChannelPermissions, Permissions } from './constants'
import { createContainer } from '@innatical/innstate'
import { useRouteMatch } from 'react-router-dom'
import { getCommunities } from '../user/remote'
import { ChannelResponse } from '../views/chat/remote'
import { useCommunities } from '../user/state'
import { useCommunity } from '../views/community/state'
import { useMatch, useMatchRoute } from 'react-location'

export const getHighestOrder = (groups: GroupResponse[]) => {
  const groupOrders = groups.map((group) => group?.order)
  if (groupOrders.length < 1) return 0
  return groupOrders.reduce((a = 0, b = 0) => (b > a ? b : a)) ?? 0
}

export const useHasPermission = () => {
  const {
    params: { id }
  } = useMatch()
  // const match = useRouteMatch<{ id: string }>('/communities/:id')
  const matchRoute = useMatchRoute()
  const auth = Auth.useContainer()
  // const { data: community } = useQuery(
  //   ['community', match?.params.id, auth.token],
  //   getCommunity,
  //   {
  //     enabled: !!auth.token && !!match?.params.id
  //   }
  // )
  console.log(id)
  const community = useCommunity(id)
  const groupIDs: any[] = []
  // const { data: groupIDs } = useQuery(
  //   ['groups', id, auth.token],
  //   async () => getGroups('', id, auth.token!),
  //   {
  //     enabled: !!auth.token && !!id
  //   }
  // )
  const communities = useCommunities()

  const member: any = {}
  // const { data: member } = useQuery(
  //   ['member', auth.id, auth.token],
  //   async () => getMember('', auth.id!, auth.token!),
  //   {
  //     enabled: !!auth.token && !!id && !!auth.id
  //   }
  // )

  // const hasPermissions = useCallback(
  //   (permissions: Permissions[], overrides?: boolean) => {
  //     return (
  //       !!member?.permissions?.some(
  //         (permission) =>
  //           permissions.includes(permission) ||
  //           (!overrides &&
  //             (permission === Permissions.ADMINISTRATOR ||
  //               permission === Permissions.OWNER))
  //       ) ||
  //       permissions.some((p) => community?.base_permissions?.includes(p)) ||
  //       community?.ownerID === auth.id
  //     )
  //   },
  //   [community, auth.id, member?.permissions]
  // )

  const hasPermissions = (any: any) => true
  const hasChannelPermissions = useCallback(
    (permissions: ChannelPermissions[], channel: ChannelResponse) => {
      if (
        member?.permissions?.includes(Permissions.ADMINISTRATOR) ||
        member?.permissions?.includes(Permissions.OWNER) ||
        community?.ownerID === auth.id
      )
        return true
      const overrideGroup = Object.entries(channel?.overrides ?? {}).find(
        ([groupID]) => member?.groups?.includes(groupID)
      )
      if (overrideGroup) {
        if (
          (overrideGroup[1].allow ?? []).some((permission) =>
            permissions.includes(permission)
          )
        )
          return true

        if (
          (overrideGroup[1].deny ?? []).some((permission) =>
            permissions.includes(permission)
          )
        )
          return false
      }

      if (
        (channel?.baseAllow ?? []).some((permission) =>
          permissions.includes(permission)
        )
      )
        return true
      if (
        (channel?.baseDeny ?? []).some((permission) =>
          permissions.includes(permission)
        )
      )
        return false

      // @ts-ignore
      return hasPermissions(permissions)
    },
    [
      member?.groups,
      hasPermissions,
      member?.permissions,
      community?.ownerID,
      auth.id
    ]
  )

  const protectedGroups = useMemo(() => {
    return community?.ownerID !== auth.id
      ? (groupIDs ?? []).filter((group, index) => {
          if (!groupIDs) return false
          return groupIDs.length - index >= (member?.highest_order ?? 0)
        })
      : []
  }, [groupIDs, member?.highest_order, auth.id, community?.ownerID])
  return {
    community,
    hasChannelPermissions,
    hasPermissions,
    groupIDs,
    protectedGroups
  }
}

export const Permission = createContainer(useHasPermission)
