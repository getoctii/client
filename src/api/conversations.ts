import { clientGateway } from '@/utils/constants'
import { isTag } from '@/utils/validations'

export type FindResponse = {
  id: string
  avatar: string
  username: string
  discriminator: number
}

export type formData = { tag: string }

export const validate = (values: formData) => {
  const errors: { tag?: string } = {}
  if (!values.tag || !isTag(values.tag))
    errors.tag = 'A valid username is required'
  return errors
}

export enum ConversationType {
  DM = 'DM',
  GROUP = 'GROUP'
}

export interface Conversation {
  id: string
  name: string
  icon?: string
  type: ConversationType
  channelID: string
}

export const getConversation = async (
  conversationID: string,
  token: string
) => {
  return (
    await clientGateway.get<Conversation>(`/conversations/${conversationID}`, {
      headers: { Authorization: token }
    })
  ).data
}

export enum ConversationMemberPermission {
  MEMBER = 'MEMBER',
  ADMINISTRATOR = 'ADMINISTRATOR',
  OWNER = 'OWNER'
}

export interface ConversationMember {
  permission: ConversationMemberPermission
  userID: string
}

export const getConversationMembers = async (
  conversationID: string,
  token: string
) => {
  return (
    await clientGateway.get<ConversationMember[]>(
      `/conversations/${conversationID}/members`,
      {
        headers: { Authorization: token }
      }
    )
  ).data
}

export const createConversation = async (
  token: string,
  values:
    | { type: ConversationType.DM; recipient?: string }
    | { type: ConversationType.GROUP; recipients?: string[] }
) =>
  (
    await clientGateway.post<{
      id: string
    }>('/conversations', values, {
      headers: { Authorization: token }
    })
  ).data

export const editConversation = async (
  conversationID: string,
  name: string,
  token: string
) =>
  (
    await clientGateway.patch(
      `/conversations/${conversationID}`,
      {
        name
      },
      {
        headers: { Authorization: token }
      }
    )
  ).data

export const addConversationMember = async (
  conversationID: string,
  memberID: string,
  token: string
) =>
  (
    await clientGateway.put<{
      id: string
    }>(
      `/conversations/${conversationID}/members/${memberID}`,
      {
        permission: ConversationMemberPermission.MEMBER
      },
      {
        headers: { Authorization: token }
      }
    )
  ).data

export const promoteConversationMember = async (
  conversationID: string,
  memberID: string,
  token: string
) =>
  (
    await clientGateway.put<{
      id: string
    }>(
      `/conversations/${conversationID}/members/${memberID}`,
      {
        permission: ConversationMemberPermission.ADMINISTRATOR
      },
      {
        headers: { Authorization: token }
      }
    )
  ).data

export const demoteConversationMember = async (
  conversationID: string,
  memberID: string,
  token: string
) =>
  (
    await clientGateway.put<{
      id: string
    }>(
      `/conversations/${conversationID}/members/${memberID}`,
      {
        permission: ConversationMemberPermission.MEMBER
      },
      {
        headers: { Authorization: token }
      }
    )
  ).data

export const removeConversationMember = async (
  conversationID: string,
  memberID: string,
  token: string
) =>
  (
    await clientGateway.delete<{
      id: string
    }>(`/conversations/${conversationID}/members/${memberID}`, {
      headers: { Authorization: token }
    })
  ).data

export const leaveConversation = async (
  conversationID: string,
  token: string
) =>
  (
    await clientGateway.post<{
      id: string
    }>(
      `/conversations/${conversationID}/leave`,
      {},
      {
        headers: { Authorization: token }
      }
    )
  ).data

export const findUser = async (
  token: string | null,
  username: string,
  discriminator: string
) =>
  (
    await clientGateway.get<FindResponse>('/users/find', {
      headers: { Authorization: token },
      params: {
        username: username,
        discriminator: discriminator
      }
    })
  ).data
