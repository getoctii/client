import useSubscribe from './subscribe'
import useNewMessage from './newMessage'
import useLog from './log'
import { useConversationEvents } from '@/hooks/conversations'
import { useUserEvents } from '@/hooks/users'
import { useChannelEvents } from '@/hooks/channels'

const EventSource = () => {
  const [socket] = useSubscribe()

  useLog(socket)
  useConversationEvents(socket)
  useUserEvents(socket)
  useNewMessage(socket)
  useChannelEvents(socket)
  return <></>
}

export default EventSource
