import { useQuery } from 'react-query'
import { Auth } from '@/state/auth'
import { ChannelResponse, getChannels, getCommunity } from '@/api/communities'

export const useChannels = (communityID?: string) => {
  const { token } = Auth.useContainer()
  const { data: channels } = useQuery(
    ['channels', token],
    async () => getChannels(communityID!, token!),
    {
      enabled: !!token && !!communityID
    }
  )
  return channels
}

export const useCommunity = (communityID?: string) => {
  const { token } = Auth.useContainer()
  const { data: community } = useQuery(
    ['community', communityID, token],
    async () => getCommunity(communityID!, token!),
    {
      enabled: !!token && !!communityID
    }
  )
  return community
}
