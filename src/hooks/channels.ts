import { ChannelResponse } from '@/api/messages'
import { Auth } from '@/state/auth'
import { log } from '@/utils/logging'
import queryClient from '@/utils/queryClient'
import { useEffect } from 'react'
import { Socket } from 'socket.io-client'

enum ChannelEvents {
  MEMBER_VOICE_JOIN = 'MEMBER_VOICE_JOIN',
  MEMBER_VOICE_LEAVE = 'MEMBER_VOICE_LEAVE'
}

export const useChannelEvents = (socket: Socket | null) => {
  const { token, id: currentUserID } = Auth.useContainer()
  useEffect(() => {
    if (!socket) return
    const handler = async ({
      id,
      userID,
      roomID
    }: {
      id: string
      userID: string
      roomID: string
    }) => {
      log('Events', 'purple', 'MEMBER_VOICE_JOIN')

      queryClient.setQueryData<ChannelResponse>(
        ['channel', id, token!],
        (initial) => {
          return {
            ...initial!,
            voiceUsers: [...initial?.voiceUsers!, userID]
          }
        }
      )
    }

    socket.on(ChannelEvents.MEMBER_VOICE_JOIN, handler)

    return () => {
      socket.off(ChannelEvents.MEMBER_VOICE_JOIN, handler)
    }
  }, [socket])

  useEffect(() => {
    if (!socket) return
    const handler = async ({
      id,
      userID,
      roomID
    }: {
      id: string
      userID: string
      roomID: string
    }) => {
      log('Events', 'purple', 'MEMBER_VOICE_LEAVE')

      queryClient.setQueryData<ChannelResponse>(
        ['channel', id, token!],
        (initial) => {
          return {
            ...initial!,
            voiceUsers: initial!.voiceUsers!.filter((u) => u !== userID)
          }
        }
      )
    }

    socket.on(ChannelEvents.MEMBER_VOICE_LEAVE, handler)

    return () => {
      socket.off(ChannelEvents.MEMBER_VOICE_LEAVE, handler)
    }
  }, [socket])
}
