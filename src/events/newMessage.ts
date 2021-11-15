import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { useQuery } from 'react-query'
import queryClient from '../utils/queryClient'
import { isPlatform } from '@ionic/react'
import Typing from '../state/typing'
import { Plugins } from '@capacitor/core'
import { Events, MessageTypes } from '../utils/constants'
import { Auth } from '../views/authentication/state'
import {
  getKeychain,
  getUser,
  // ParticipantsResponse,
  State,
  Unreads,
  UserResponse
} from '../user/remote'
import { log } from '../utils/logging'
import { Chat } from '../views/chat/state'
import { parseMarkdown } from '@innatical/markdown'
import { useSuspenseStorageItem } from '../utils/storage'
import { ChannelResponse, MessageResponse } from '../views/chat/remote'
import { Keychain } from '../keychain/state'
// import {
//   decryptMessage,
//   importEncryptedMessage,
//   importPublicKey
// } from '@innatical/inncryption'
// import { ExportedEncryptedMessage } from '@innatical/inncryption/dist/types'
import { Socket } from 'socket.io-client'
import { useCurrentUser } from '../user/state'

// interface Message {
//   self_encrypted_content: ExportedEncryptedMessage
//   encrypted_content: ExportedEncryptedMessage
//   id: string
//   channel_id: string
//   author: {
//     id: string
//     username: string
//     avatar: string
//     discriminator: number
//   }
//   type: MessageTypes
//   created_at: string
//   updated_at: string
//   content: string
//   community_id?: string
//   community_name?: string
//   channel_name?: string
// }

declare global {
  interface Window {
    inntronNotify?: (title: string, body: string) => Promise<null>
    inntronType?: 'native' | 'cross'
    inntronPlatform?: 'macos' | 'windows' | 'linux'
  }
}

const useNewMessage = (socket: Socket | null) => {
  const { autoRead, channelID } = Chat.useContainerSelector(
    ({ autoRead, channelID }) => ({
      autoRead,
      channelID
    })
  )
  const { id, token } = Auth.useContainer()
  const { stopTyping } = Typing.useContainer()
  const [mutedCommunities] = useSuspenseStorageItem<string[]>(
    'muted-communities',
    []
  )
  const [mutedChannels] = useSuspenseStorageItem<string[]>('muted-channels', [])
  const user = useCurrentUser()
  const { keychain } = Keychain.useContainer()
  useEffect(() => {
    if (!socket) return
    const handler = async (channelID: string, message: MessageResponse) => {
      log('Events', 'purple', 'newMessage')

      queryClient.setQueryData<MessageResponse>(
        ['message', message.id, token],
        {
          ...message
        }
      )

      // const participants = queryClient.getQueryData<ParticipantsResponse>([
      //   'participants',
      //   id,
      //   token
      // ])

      // const otherKeychain = await queryClient.fetchQuery(
      //   ['keychain', message.authorID, token],
      //   getKeychain,
      //   {
      //     staleTime: Infinity
      //   }
      // )

      // const publicKey = await queryClient.fetchQuery(
      //   ['publicKey', otherKeychain?.signing.publicKey],
      //   async (_: string, key: number[]) => {
      //     if (!key) return undefined
      //     return await importPublicKey(key, 'signing')
      //   },
      //   {
      //     staleTime: Infinity
      //   }
      // )

      // const content = await queryClient.fetchQuery(
      //   [
      //     'messageContent',
      //     event?.content ??
      //       (event?.author.id === id
      //         ? event.self_encrypted_content
      //         : event?.encrypted_content),
      //     publicKey,
      //     keychain
      //   ],
      //   async () => {
      //     const content =
      //       event?.content ??
      //       (event?.author.id === id
      //         ? event.self_encrypted_content
      //         : event?.encrypted_content)
      //     if (typeof content === 'string') {
      //       return content
      //     } else {
      //       if (!publicKey || !keychain || !content) return ''
      //       try {
      //         const decrypted = await decryptMessage(
      //           keychain,
      //           publicKey,
      //           importEncryptedMessage(content)
      //         )

      //         if (decrypted.verified) {
      //           return decrypted.message
      //         } else {
      //           return '*The sender could not be verified...*'
      //         }
      //       } catch {
      //         return '*Message could not be decrypted*'
      //       }
      //     }
      //   }
      // )

      const messages = queryClient.getQueryData<
        { pages: MessageResponse[][] } | undefined
      >(['messages', channelID, token])

      // console.log('$$$', messages)
      // console.log('$$$$', {
      //   ...messages,
      //   pages:
      //     messages.pages[0].length < 25
      //       ? [[message, ...messages.pages[0]], ...messages.pages.slice(1)]
      //       : [[message], ...messages.pages]
      // })

      if (messages) {
        queryClient.setQueryData<{ pages: MessageResponse[][] }>(
          ['messages', channelID, token],
          {
            ...messages,
            pages:
              messages.pages[0].length < 25
                ? [[message, ...messages.pages[0]], ...messages.pages.slice(1)]
                : [[message], ...messages.pages]
          }
        )
      }

      const channel = queryClient.getQueryData<ChannelResponse>([
        'channel',
        channelID,
        token
      ])

      if (channel) {
        queryClient.setQueryData<ChannelResponse>(
          ['channel', channelID, token],
          { ...channel, lastMessageID: message.id }
        )
      }

      // if (participants instanceof Array) {
      //   queryClient.setQueryData<ParticipantsResponse>(
      //     ['participants', id, token],
      //     participants.map((participant) =>
      //       participant?.conversation?.channel_id === channelID
      //         ? {
      //             ...participant,
      //             conversation: {
      //               ...participant.conversation,
      //               last_message_id: event.id,
      //               last_message_date: event.created_at
      //             }
      //           }
      //         : participant
      //     )
      //   )
      // }

      // queryClient.setQueryData<Unreads>(['unreads', id, token], (initial) => {
      //   if (initial) {
      //     return {
      //       ...initial,
      //       [event.channel_id]: {
      //         ...(initial[event.channel_id] ?? {}),
      //         last_message_id: event.id,
      //         read:
      //           id === event.author.id ||
      //           (autoRead && event.channel_id === channelID)
      //             ? event.id
      //             : initial[event.channel_id]?.read
      //       }
      //     }
      //   } else {
      //     return {
      //       [event.channel_id]: {
      //         last_message_id: event.id,
      //         read:
      //           id === event.author.id ||
      //           (autoRead && event.channel_id === channelID)
      //             ? event.id
      //             : ''
      //       }
      //     }
      //   }
      // })

      // if (
      //   event.author.id !== id &&
      //   !mutedCommunities?.includes(event.community_id ?? '') &&
      //   !mutedChannels?.includes(event.channel_id) &&
      //   user.data?.state !== State.dnd
      // ) {
      //   const output = parseMarkdown(content, {
      //     bold: (str) => str,
      //     italic: (str) => str,
      //     underlined: (str) => str,
      //     strikethough: (str) => str,
      //     link: (str) => str,
      //     codeblock: (str) => str,
      //     custom: [
      //       [
      //         /<@([A-Za-z0-9-]+?)>/g,
      //         (str) => {
      //           const mention = queryClient.getQueryData<UserResponse>([
      //             'users',
      //             str,
      //             token
      //           ])
      //           return `@${mention?.username || 'someone'}`
      //         }
      //       ]
      //     ]
      //   }).join('')
      //   if (window.inntronNotify) {
      //     try {
      //       await window.inntronNotify(
      //         `${
      //           event.community_name
      //             ? event.community_name
      //             : event.author.username
      //         }${event.channel_name ? ` #${event.channel_name}` : ''}`,
      //         `${
      //           event.community_name ? `${event.author.username}: ` : ''
      //         }${output}`
      //       )
      //     } catch (error) {
      //       console.error(error)
      //     }
      //   } else if (!isPlatform('capacitor')) {
      //     try {
      //       const { granted } =
      //         await Plugins.LocalNotifications.requestPermission()
      //       if (granted) {
      //         await Plugins.LocalNotifications.schedule({
      //           notifications: [
      //             {
      //               title: `${
      //                 event.community_name
      //                   ? event.community_name
      //                   : event.author.username
      //               }${event.channel_name ? ` #${event.channel_name}` : ''}`,
      //               body: `${
      //                 event.community_name ? `${event.author.username}: ` : ''
      //               }${output}`,
      //               id: 1
      //             }
      //           ]
      //         })
      //       }
      //     } catch (error) {
      //       console.error(error)
      //     }
      //   }
      // }
      // stopTyping(event.channel_id, event.author.id)
    }

    socket.on(Events.NEW_MESSAGE, handler)

    return () => {
      socket.off(Events.NEW_MESSAGE, handler)
    }
  }, [
    socket,
    mutedCommunities,
    mutedChannels,
    id,
    stopTyping,
    user,
    token,
    autoRead,
    channelID,
    keychain
  ])
}

export default useNewMessage
