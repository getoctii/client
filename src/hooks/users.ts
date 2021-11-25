import { useQuery } from 'react-query'
import { Auth } from '@/state/auth'
import {
  getCommunities,
  getConversations,
  getCurrentUser,
  getRelationships,
  getUser
} from '@/api/users'
import { Socket } from 'socket.io-client'
import { useEffect } from 'react'
import { log } from '@/utils/logging'
import queryClient from '@/utils/queryClient'

enum UserEvents {
  CONVERSATION_CREATE = 'CONVERSATION_CREATE'
}

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
  const { token } = Auth.useContainer()
  const { data: communities } = useQuery(
    ['communities', token],
    async () => getCommunities(token!),
    {
      enabled: !!token
    }
  )
  return communities
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

export const useUserEvents = (socket: Socket | null) => {
  const { token } = Auth.useContainer()
  useEffect(() => {
    if (!socket) return
    const handler = async ({ id }: { id: string }) => {
      log('Events', 'purple', 'CONVERSATION_CREATE')

      queryClient.setQueryData<string[]>(
        ['conversations', token!],
        (initial) => {
          return [...(initial ?? []), id]
        }
      )
    }

    socket.on(UserEvents.CONVERSATION_CREATE, handler)

    return () => {
      socket.off(UserEvents.CONVERSATION_CREATE, handler)
    }
  }, [socket])
}
