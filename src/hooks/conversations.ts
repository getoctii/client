import { useQuery } from 'react-query'
import { Auth } from '@/state/auth'
import { getConversation, getConversationMembers } from '@/api/conversations'

export const useConversation = (conversationID?: string) => {
  const { token } = Auth.useContainer()
  const { data: conversation } = useQuery(
    ['conversation', conversationID, token],
    async () => getConversation(conversationID!, token!),
    {
      enabled: !!token && !!conversationID
    }
  )

  return conversation
}

export const useConversationMembers = (conversationID?: string) => {
  const { token } = Auth.useContainer()
  const { data: members } = useQuery(
    ['conversationMembers', conversationID, token],
    async () => getConversationMembers(conversationID!, token!),
    {
      enabled: !!token && !!conversationID
    }
  )

  return members ?? []
}
