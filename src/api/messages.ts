import {
  EncryptedMessage,
  Keychain,
  SymmetricKey
} from '@innatical/inncryption'
import axios from 'axios'
import {
  ChannelPermissions,
  ChannelTypes,
  clientGateway,
  MessageTypes
} from '@/utils/constants'
import queryClient from '@/utils/queryClient'

export interface Override {
  allow: ChannelPermissions[]
  deny: ChannelPermissions[]
}

export interface ChannelResponse {
  id: string
  name: string
  color?: string
  description?: string
  type: ChannelTypes
  order: number
  parentID?: string
  communityID?: string
  baseAllow?: ChannelPermissions[]
  baseDeny?: ChannelPermissions[]
  overrides?: {
    [groupID: string]: Override
  }
  voice_users?: string[]
  webhook_code?: string
  lastMessageID?: string
  lastMessageDate?: Date
  lastReadMessageID?: string
}

export interface MessageResponse {
  id: string
  createdAt: string
  updatedAt: string
  authorID: string
  payload: EncryptedMessage | { content: string }
}

export const getMessage = async (messageID: string, token: string) =>
  !messageID
    ? undefined
    : (
        await clientGateway.get<MessageResponse>(`/messages/${messageID}`, {
          headers: {
            Authorization: token
          }
        })
      ).data

export const getChannel = async (channelID: string, token: string) =>
  (
    await clientGateway.get<ChannelResponse>(`/channels/${channelID}`, {
      headers: {
        Authorization: token
      }
    })
  ).data

export const postTyping = async (channelID: string, token: string) =>
  (
    await clientGateway.post(`/channels/${channelID}/typing`, undefined, {
      headers: {
        Authorization: token
      }
    })
  ).data

export const postMessage = async (
  channelID: string,
  content: string,
  token: string
) =>
  (
    await clientGateway.post(
      `/channels/${channelID}/messages`,
      { payload: { content } },
      { headers: { Authorization: token } }
    )
  ).data

export const postEncryptedMessage = async (
  channelID: string,
  content: string,
  token: string,
  keychain: Keychain,
  sessionKey: SymmetricKey
) => {
  const encryptedMessage = await sessionKey.encrypt(
    await keychain.signing.sign({ content })
  )

  queryClient.setQueryData(
    ['messageContent', encryptedMessage, sessionKey, keychain],
    content
  )

  return (
    await clientGateway.post(
      `/channels/${channelID}/messages`,
      { payload: encryptedMessage },
      { headers: { Authorization: token } }
    )
  ).data
}

export const uploadFile = async (file: File, token: string) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await axios.post<{ file: string }>(
    'https://api.octii.chat/cdn/file',
    formData,
    {
      headers: {
        Authorization: token
      }
    }
  )
  return response.data.file
}

export const patchMessage = async (
  messageID: string,
  content: string,
  token: string
) =>
  (
    await clientGateway.patch(
      `/messages/${messageID}`,
      { content },
      { headers: { Authorization: token } }
    )
  ).data

export const patchEncryptedMessage = async (
  messageID: string,
  content: string,
  token: string,
  keychain: any,
  publicKey: JsonWebKey
) => {
  // const selfEncryptedMessage = exportEncryptedMessage(
  //   await encryptMessage(
  //     keychain,
  //     keychain.encryptionKeyPair.publicKey!,
  //     content
  //   )
  // )
  // const encryptedMessage = exportEncryptedMessage(
  //   await encryptMessage(keychain, publicKey, content)
  // )
  // return (
  //   await clientGateway.patch(
  //     `/messages/${messageID}`,
  //     {
  //       encrypted_content: encryptedMessage,
  //       self_encrypted_content: selfEncryptedMessage
  //     },
  //     { headers: { Authorization: token } }
  //   )
  // ).data
  return {
    encrypted_content: '',
    self_encrypted_content: ''
  }
}

export const getMessages = async (
  channelID: string,
  token: string,
  lastMessageID: string
) =>
  (
    await clientGateway.get<MessageResponse[]>(
      `/channels/${channelID}/messages`,
      {
        headers: { Authorization: token },
        params: { lastID: lastMessageID }
      }
    )
  ).data

export const getMessageContent = async (
  _: string,
  content?: string | any | null,
  signing?: CryptoKey | null,
  keychain?: any | null
) => {
  if (typeof content === 'string') {
    return content
  } else {
    if (!signing || !keychain || !content) return ''
    try {
      // const decrypted = await decryptMessage(
      //   keychain,
      //   signing,
      //   importEncryptedMessage(content)
      // )

      // if (decrypted.verified) {
      //   return decrypted.message
      // } else {
      return '*The sender could not be verified...*'
      // }
    } catch {
      return '*Message could not be decrypted*'
    }
  }
}
