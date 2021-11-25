import { Auth } from '@/state/auth'
import { getChannel, getMessage, MessageResponse } from '@/api/messages'

import { useQuery } from 'react-query'
import { Keychain } from '@/state/keychain'
import {
  EncryptedMessage,
  SignedMessage,
  SigningPair
} from '@innatical/inncryption'
import { useUser } from './users'
import { useSessionKey } from './conversations'

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

export const useMessage = (messageID?: string) => {
  const { token } = Auth.useContainer()
  const { data: message } = useQuery(
    ['message', messageID, token],
    async () => getMessage(messageID!, token!),
    {
      enabled: !!token && !!messageID
    }
  )

  return message
}

export const useDecryptMessage = ({
  id,
  payload,
  authorID,
  conversationID
}: {
  id?: string
  payload?: { content: string } | EncryptedMessage
  authorID?: string
  conversationID?: string
}) => {
  const { keychain } = Keychain.useContainer()
  const sessionKey = useSessionKey(conversationID)
  const user = useUser(authorID)
  const { data: messageContent } = useQuery(
    ['messageContent', id, keychain],
    async () => {
      if (typeof payload === 'string') {
        return payload
      }
      if (payload && 'content' in payload) {
        return payload.content
      } else {
        try {
          if (sessionKey && payload) {
            const message = (await sessionKey.decrypt(payload)) as SignedMessage
            if (!user?.keychain.publicKeychain.signing)
              return 'Signing key not found'
            const unwrapped = await SigningPair.verify(
              message,
              user.keychain.publicKeychain.signing
            )
            if (unwrapped.ok) {
              return (unwrapped.message as { content: string }).content
            } else {
              return 'Unable to decrypt message'
            }
          }
        } catch (error) {
          console.error(error)
          return 'Unable to decrypt message'
        }
        return
      }
    },
    {
      enabled: (!!sessionKey || (payload && 'content' in payload)) && !!id
    }
  )

  return messageContent
}
