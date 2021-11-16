import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { Events } from '../utils/constants'
import { log } from '../utils/logging'
import { Auth } from '@/state/auth'
import { MessageResponse } from '@/api/messages'
import { ExportedEncryptedMessage } from '@innatical/inncryption/dist/types'
import { getKeychain } from '@/api/users'
import {
  decryptMessage,
  importEncryptedMessage,
  importPublicKey
} from '@innatical/inncryption'
import { Keychain } from '@/state/keychain'
import queryClient from '../utils/queryClient'

const useUpdatedMessage = (eventSource: EventSourcePolyfill | null) => {
  const { id, token } = Auth.useContainer()
  const { keychain } = Keychain.useContainer()

  useEffect(() => {
    if (!eventSource) return
    const handler = async (e: MessageEvent) => {
      const event = JSON.parse(e.data) as {
        id: string
        channel_id: string
        content: string
        updated_at: string
        encrypted_content: ExportedEncryptedMessage
        self_encrypted_content: ExportedEncryptedMessage
      }
      log('Events', 'purple', 'UPDATED_MESSAGE')

      const initial = queryClient.getQueryData([
        'messages',
        event.channel_id,
        token
      ])
      if (initial instanceof Array) {
        queryClient.setQueryData(
          ['messages', event.channel_id, token],
          await Promise.all(
            initial.map(
              async (sub) =>
                await Promise.all(
                  sub.map(async (msg: MessageResponse) => {
                    if (msg.id === event.id) {
                      const otherKeychain = await queryClient.fetchQuery(
                        ['keychain', msg.author_id, token],
                        getKeychain,
                        {
                          staleTime: Infinity
                        }
                      )

                      const publicKey = await queryClient.fetchQuery(
                        ['publicKey', otherKeychain?.signing.publicKey],
                        async (_: string, key: number[]) => {
                          if (!key) return undefined
                          return await importPublicKey(key, 'signing')
                        },
                        {
                          staleTime: Infinity
                        }
                      )

                      await queryClient.fetchQuery(
                        [
                          'messageContent',
                          event?.content ??
                            (msg.author_id === id
                              ? event.self_encrypted_content
                              : event?.encrypted_content),
                          publicKey,
                          keychain
                        ],
                        async () => {
                          const content =
                            event?.content ??
                            (msg.author_id === id
                              ? event.self_encrypted_content
                              : event?.encrypted_content)
                          if (typeof content === 'string') {
                            return content
                          } else {
                            if (!publicKey || !keychain || !content) return ''
                            try {
                              const decrypted = await decryptMessage(
                                keychain,
                                publicKey,
                                importEncryptedMessage(content)
                              )

                              if (decrypted.verified) {
                                return decrypted.message
                              } else {
                                return '*The sender could not be verified...*'
                              }
                            } catch {
                              return '*Message could not be decrypted*'
                            }
                          }
                        }
                      )

                      return {
                        ...msg,
                        content: event.content,
                        updated_at: event.updated_at,
                        encrypted_content: event.encrypted_content,
                        self_encrypted_content: event.self_encrypted_content
                      }
                    } else {
                      return msg
                    }
                  })
                )
            )
          )
        )
      }
    }

    eventSource.addEventListener(Events.UPDATED_MESSAGE, handler)

    return () => {
      eventSource.removeEventListener(Events.UPDATED_MESSAGE, handler)
    }
  }, [eventSource, id, token, keychain])
}

export default useUpdatedMessage
