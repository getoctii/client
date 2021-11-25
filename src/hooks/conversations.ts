import { useQuery } from 'react-query'
import { Auth } from '@/state/auth'
import {
  Conversation,
  ConversationMember,
  ConversationMemberPermission,
  ConversationType,
  getConversation,
  getConversationMembers
} from '@/api/conversations'
import { getUser } from '@/api/users'
import { Keychain } from '@/state/keychain'
import { Socket } from 'socket.io-client'
import { log } from '@/utils/logging'
import { useEffect } from 'react'
import queryClient from '@/utils/queryClient'
import { useMatch, useMatches, useNavigate } from 'react-location'
enum ConversationEvents {
  MEMBER_ADD = 'MEMBER_ADD',
  MEMBER_UPDATE = 'MEMBER_UPDATE',
  MEMBER_REMOVE = 'MEMBER_REMOVE',
  MEMBER_LEAVE = 'MEMBER_LEAVE',
  CONVERSATION_UPDATE = 'CONVERSATION_UPDATE'
}

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
  const otherDMUser = useOtherDMUser(conversationID)
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

export const useConversationEvents = (socket: Socket | null) => {
  const { token, id: currentUserID } = Auth.useContainer()
  const matches = useMatches()
  const navigate = useNavigate()
  useEffect(() => {
    if (!socket) return
    const handler = async ({
      id,
      userID,
      permission
    }: {
      id: string
      userID: string
      permission: ConversationMemberPermission
    }) => {
      log('Events', 'purple', 'MEMBER_ADD')

      queryClient.setQueryData<ConversationMember[]>(
        ['conversationMembers', id, token!],
        (initial) => {
          return [...(initial ?? []), { userID, permission }]
        }
      )
    }

    socket.on(ConversationEvents.MEMBER_ADD, handler)

    return () => {
      socket.off(ConversationEvents.MEMBER_ADD, handler)
    }
  }, [socket])

  useEffect(() => {
    if (!socket) return
    const handler = async ({
      id,
      userID,
      permission
    }: {
      id: string
      userID: string
      permission: ConversationMemberPermission
    }) => {
      log('Events', 'purple', 'MEMBER_UPDATE')

      queryClient.setQueryData<ConversationMember[]>(
        ['conversationMembers', id, token!],
        (initial) => {
          return (initial ?? []).map((member) =>
            member.userID === userID ? { ...member, permission } : member
          )
        }
      )
    }

    socket.on(ConversationEvents.MEMBER_UPDATE, handler)

    return () => {
      socket.off(ConversationEvents.MEMBER_UPDATE, handler)
    }
  }, [socket])

  useEffect(() => {
    if (!socket) return
    const handler = async ({ id, userID }: { id: string; userID: string }) => {
      log('Events', 'purple', 'MEMBER_REMOVE')

      if (userID === currentUserID) {
        queryClient.setQueryData<string[]>(
          ['conversations', token!],
          (initial) => {
            return initial?.filter((member) => member !== id) ?? []
          }
        )
        queryClient.removeQueries(['conversationMembers', id, token!])
        queryClient.removeQueries(['conversation', id, token!])
        if (!!matches.find((m) => m.params.id === id))
          navigate({ to: '/app/conversations' })
      } else {
        queryClient.setQueryData<ConversationMember[]>(
          ['conversationMembers', id, token!],
          (initial) => {
            return initial?.filter((member) => member.userID !== userID) ?? []
          }
        )
      }
    }

    socket.on(ConversationEvents.MEMBER_REMOVE, handler)

    return () => {
      socket.off(ConversationEvents.MEMBER_REMOVE, handler)
    }
  }, [socket, matches])

  useEffect(() => {
    if (!socket) return
    const handler = async ({ id, userID }: { id: string; userID: string }) => {
      log('Events', 'purple', 'MEMBER_LEAVE')

      if (userID === currentUserID) {
        queryClient.setQueryData<string[]>(
          ['conversations', token!],
          (initial) => {
            return initial?.filter((member) => member !== id) ?? []
          }
        )
      } else {
        queryClient.setQueryData<ConversationMember[]>(
          ['conversationMembers', id, token!],
          (initial) => {
            return initial?.filter((member) => member.userID !== userID) ?? []
          }
        )
      }
    }

    socket.on(ConversationEvents.MEMBER_LEAVE, handler)

    return () => {
      socket.off(ConversationEvents.MEMBER_LEAVE, handler)
    }
  }, [socket])

  useEffect(() => {
    if (!socket) return
    const handler = async ({
      id,
      name,
      authorID
    }: {
      id: string
      name: string
      authorID: string
    }) => {
      log('Events', 'purple', 'CONVERSATION_UPDATE')

      queryClient.setQueryData<Conversation>(
        ['conversation', id, token!],
        (initial) => {
          return { ...initial!, name }
        }
      )
    }

    socket.on(ConversationEvents.CONVERSATION_UPDATE, handler)

    return () => {
      socket.off(ConversationEvents.CONVERSATION_UPDATE, handler)
    }
  }, [socket])
}
