import { useQuery } from 'react-query'
import { Auth } from '@/state/auth'
import {
  ConversationType,
  getConversation,
  getConversationMembers
} from '@/api/conversations'
import { getUser } from '@/api/users'
import { Keychain } from '@/state/keychain'

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

export const useOtherDMUser = (conversationID?: string) => {
  const { token, id } = Auth.useContainer()
  const conversation = useConversation(conversationID)
  const members = useConversationMembers(conversationID)

  const { data: otherDMUser } = useQuery(
    ['users', members?.find((m) => m.userID !== id)?.userID, token],
    () => getUser(members!.find((m) => m.userID !== id)!.userID, token!),
    {
      enabled:
        conversation?.type === ConversationType.DM &&
        !!token &&
        !!members?.find((m) => m.userID !== id)
    }
  )

  return otherDMUser
}

export const useSessionKey = (conversationID?: string) => {
  console.log(conversationID)
  const otherDMUser = useOtherDMUser(conversationID)
  console.log(otherDMUser)
  const { keychain } = Keychain.useContainer()
  const { data: sessionKey } = useQuery(
    ['sessionKey', otherDMUser?.keychain.publicKeychain.encryption],
    () =>
      keychain!.encryption.sessionKey(
        otherDMUser!.keychain.publicKeychain.encryption
      ),
    {
      enabled: !!otherDMUser && !!conversationID
    }
  )

  return sessionKey
}
