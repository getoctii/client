import { clientGateway } from '@/utils/constants'

export const getUseInvite = async (code: string, token: string) =>
  (
    await clientGateway.get<{
      author_id: string
      community: {
        id: string
        name: string
        icon: string
        large: boolean
        owner_id: string
      }
    }>(`/invites/${code}/use`, {
      headers: {
        Authorization: token
      }
    })
  ).data
