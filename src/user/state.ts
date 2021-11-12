import { useQuery } from 'react-query'
import { Auth } from '../authentication/state'
import {
  getConversations,
  getCurrentUser,
  getRelationships,
  getUser
} from './remote'

export const useCurrentUser = () => {
  const { token } = Auth.useContainer()
  const { data: user } = useQuery(
    ['currentUser', token],
    async () => getCurrentUser(token!),
    {
      enabled: !!token
    }
  )
  return user
}

export const useUser = (userID?: string) => {
  const { token } = Auth.useContainer()
  const { data: user } = useQuery(
    ['users', userID, token],
    async () => getUser(userID!, token!),
    {
      enabled: !!token && !!userID
    }
  )

  return user
}

export const useRelationships = () => {
  const { token } = Auth.useContainer()
  const { data: relationships } = useQuery(
    ['relationships', token],
    async () => getRelationships(token!),
    {
      enabled: !!token
    }
  )
  return relationships
}

export const useCommunities = () => {
  return []
}

export const useConversations = () => {
  const { token } = Auth.useContainer()
  const { data: conversations } = useQuery(
    ['conversations', token],
    async () => getConversations(token!),
    {
      enabled: !!token
    }
  )

  return conversations ?? []
}
