import { useState, useEffect, useCallback } from 'react'
import { createContainer } from '@innatical/innstate'
import { Auth } from '@/state/auth'
import { postMessage, postEncryptedMessage, getChannel } from '@/api/messages'
import { Keychain } from '@/state/keychain'
import { useQuery } from 'react-query'
import { useCurrentUser } from '@/hooks/users'
import { SymmetricKey } from '@innatical/inncryption'

interface UploadDetails {
  status: 'uploading' | 'uploaded' | 'pending'
  file: File
}

const useChat = () => {
  const { token } = Auth.useContainer()
  const user = useCurrentUser()
  const [tracking, setTracking] = useState(true)
  const [autoRead, setAutoRead] = useState(false)
  const [channelID, setChannelID] = useState<string | undefined>()

  const [uploadDetails, setUploadDetails] = useState<UploadDetails | null>(null)
  const [editingMessageID, setEditingMessageID] = useState<string | undefined>(
    undefined
  )
  const [participants, setParticipants] = useState<string[]>([])
  const { keychain } = Keychain.useContainer()
  const sendMessage = useCallback(
    async (content: string, sessionKey?: SymmetricKey) => {
      if (!token || !channelID) return
      console.log(keychain)
      if (sessionKey && user?.keychain.publicKeychain)
        await postEncryptedMessage(
          channelID,
          content,
          token,
          keychain!,
          sessionKey!
        )
      else await postMessage(channelID, content, token)
      if (tracking) setAutoRead(true)
    },
    [token, setAutoRead, tracking, channelID, keychain]
  )

  useEffect(() => {
    if (!tracking && autoRead) setAutoRead(false)
  }, [tracking, autoRead])

  return {
    tracking,
    setTracking,
    autoRead,
    setAutoRead,
    sendMessage,
    channelID,
    setChannelID,
    uploadDetails,
    setUploadDetails,
    editingMessageID,
    setEditingMessageID,
    participants,
    setParticipants
  }
}

export const Chat = createContainer(useChat)
