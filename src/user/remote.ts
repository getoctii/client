import { JsonWebKeyPublicChain } from '@innatical/inncryption'
import { clientGateway } from '../utils/constants'
import queryClient from '../utils/queryClient'
// import { Key } from '@innatical/inncryption'

export const fetchManyUsers = (_: string, ids: string[], token: string) => {
  return Promise.all(
    ids.map((id) =>
      queryClient.fetchQuery(
        ['users', id, token],
        async () => getUser(id, token),
        {
          staleTime: Infinity
        }
      )
    )
  )
}

export enum State {
  offline = 'offline',
  idle = 'idle',
  dnd = 'dnd',
  online = 'online'
}

export type Participant = {
  id: string
  conversation: {
    id: string
    channel_id: string
    voice_channel_id: string
    last_message_id?: string
    last_message_date?: string
    participants: string[]
  }
}

interface PurchaseResponse {
  id: string
  name: string
  icon: string
  description: string
  latest_version?: number
}

export type ParticipantsResponse = Participant[]

export type UserResponse = {
  id: string
  username: string
  discriminator: number
  avatar?: string
  status: string
  state: State
  createdAt: Date
  updatedAt: Date
  badges: string[]
  flags: string[]
  keychain: {
    publicKeychain: JsonWebKeyPublicChain
  }
}

export type Member = {
  id: string
  community: {
    id: string
    name: string
    icon?: string
    large: boolean
  }
}

export interface Unreads {
  [key: string]: {
    read: string
    last_message_id: string
  }
}

export interface Mentions {
  [key: string]: {
    id: string
    message_id: string
    read: boolean
  }[]
}

export type MembersResponse = Member[]

export const getUser = async (userID: string, token: string) =>
  (
    await clientGateway.get<UserResponse>(`/users/${userID}`, {
      headers: {
        Authorization: token
      }
    })
  ).data

export const getCurrentUser = async (token: string) =>
  (
    await clientGateway.get<UserResponse>(`/users/me`, {
      headers: {
        Authorization: token
      }
    })
  ).data

export const getPurchases = async (_: string, userID: string, token: string) =>
  (
    await clientGateway.get<PurchaseResponse[]>(`/users/${userID}/purchases`, {
      headers: {
        Authorization: token
      }
    })
  ).data

export const getCommunities = async (
  _: string,
  userID: string,
  token: string
) =>
  (
    await clientGateway.get<MembersResponse>(`/users/${userID}/members`, {
      headers: {
        Authorization: token
      }
    })
  ).data

export const getParticipants = async (
  _: string,
  userID: string,
  token: string
) =>
  (
    await clientGateway.get<ParticipantsResponse>(
      `/users/${userID}/participants`,
      {
        headers: {
          Authorization: token
        }
      }
    )
  ).data

export const getUnreads = async (_: string, userID: string, token: string) =>
  (
    await clientGateway.get<Unreads>(`/users/${userID}/read`, {
      headers: {
        Authorization: token
      }
    })
  ).data

export const getMentions = async (_: string, userID: string, token: string) =>
  (
    await clientGateway.get<Mentions>(`/users/${userID}/mentions`, {
      headers: {
        Authorization: token
      }
    })
  ).data

export const getKeychain = async (_: string, userID: string, token: string) =>
  userID && token
    ? (
        await clientGateway.get<any>(`/users/${userID}/keychain`, {
          headers: {
            Authorization: token
          }
        })
      ).data
    : null
