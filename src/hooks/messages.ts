import { Auth } from '@/state/auth'
import { getChannel } from '@/api/messages'

import { useQuery } from 'react-query'

export const useChannel = (channelID?: string) => {
  const { token } = Auth.useContainer()
  const { data: channel } = useQuery(
    ['channel', channelID, token],
    async () => getChannel(channelID!, token!),
    {
      enabled: !!token && !!channelID
    }
  )

  return channel
}
