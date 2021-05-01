import { useState, useEffect, useCallback } from 'react'
import { createContainer } from '@innatical/innstate'
import { Auth } from '../authentication/state'
import { postMessage } from './remote'

interface UploadDetails {
  status: 'uploading' | 'uploaded' | 'pending'
  file: File
}

const useChat = () => {
  const { token } = Auth.useContainer()
  const [tracking, setTracking] = useState(true)
  const [autoRead, setAutoRead] = useState(false)
  const [channelID, setChannelID] = useState<string | undefined>()
  const [uploadDetails, setUploadDetails] = useState<UploadDetails | null>(null)
  const [editingMessageID, setEditingMessageID] = useState<string | undefined>(
    undefined
  )
  const [participants, setParticipants] = useState<string[]>([])
  const sendMessage = useCallback(
    async (content: string) => {
      if (!token || !channelID) return
      await postMessage(channelID, content, token)
      if (tracking) setAutoRead(true)
    },
    [token, setAutoRead, tracking, channelID]
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
