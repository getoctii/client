import {
  memo,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  FC
} from 'react'
import styles from './ConversationList.module.scss'
import { Auth } from '@/state/auth'
import { ConversationCard, NewConversation } from '@/domain/Conversation'
import { useMedia, useScroll } from 'react-use'
import dayjs from 'dayjs'
import dayjsUTC from 'dayjs/plugin/utc'
import { ScrollPosition } from '@/state/scroll'
import { StatusBar } from '@/components/Layout'
import { useConversations } from '@/hooks/users'
import { useConversation } from '@/hooks/conversations'
import { useMatch } from 'react-location'
import queryClient from '@/utils/queryClient'
import { useQueries } from 'react-query'
import { getConversation } from '@/api/conversations'
import { getChannel } from '@/api/messages'
import { ConversationCardPlaceholder } from '../ConversationCard/ConversationCard'

dayjs.extend(dayjsUTC)

const ConversationCardWrapper: FC<{ conversationID: string }> = ({
  conversationID
}) => {
  const {
    params: { id }
  } = useMatch()
  const conversation = useConversation(conversationID)
  return (
    <div key={conversationID}>
      <Suspense fallback={<ConversationCardPlaceholder />}>
        <ConversationCard
          conversationID={conversationID}
          channelID={conversation?.channelID}
        />
      </Suspense>
    </div>
  )
}

const ConversationCardList: FC = memo(() => {
  const auth = Auth.useContainer()
  const conversationIDs = useConversations()

  const conversations = useQueries(
    conversationIDs.map((id) => ({
      queryKey: ['conversation', id, auth.token],
      queryFn: async () => getConversation(id, auth.token!)
    }))
  )

  const channels = useQueries(
    conversations.map(({ data: conversation }) => ({
      queryKey: ['channel', conversation?.channelID, auth.token],
      queryFn: async () => getChannel(conversation?.channelID!, auth.token!),
      enabled: !!conversation
    }))
  )
  return (
    <>
      {conversations && conversations.length > 0 ? (
        conversations
          .sort(({ data: a }, { data: b }) => {
            const channelA = channels.find(
              ({ data: c }) => c?.id === a?.channelID
            )?.data
            const channelB = channels.find(
              ({ data: c }) => c?.id === b?.channelID
            )?.data

            if (
              (channelB?.lastMessageDate ?? new Date()) >
              (channelA?.lastMessageDate ?? new Date())
            )
              return 1
            else if (
              (channelB?.lastMessageDate ?? new Date()) <
              (channelA?.lastMessageDate ?? new Date())
            )
              return -1
            else return 0
          })
          .map(({ data: conversation }) => {
            return (
              <ConversationCardWrapper
                key={conversation?.id!}
                conversationID={conversation?.id!}
              />
            )
          })
      ) : (
        <div className={styles.alert}>
          <h4>You aren't in any chats!</h4>
          <p>Use the search bar to create new chats using usernames.</p>
        </div>
      )}
    </>
  )
})

const ConversationsPlaceholder: FC = () => {
  const length = useMemo(() => Math.floor(Math.random() * 10) + 1, [])
  return (
    <>
      {Array.from(Array(length).keys()).map((_, index) => (
        <>
          {index !== 0 && <hr />}
          <ConversationCardPlaceholder key={index} />
        </>
      ))}
    </>
  )
}

const ConversationList: FC = () => {
  const isMobile = useMedia('(max-width: 740px)')
  const scrollRef = useRef<HTMLDivElement>(null)
  const currentScrollPosition = useScroll(scrollRef)
  const {
    conversation: [scrollPosition, setScrollPosition]
  } = ScrollPosition.useContainer()

  useLayoutEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTo(scrollPosition.x, scrollPosition.y)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setScrollPosition(currentScrollPosition)
  }, [currentScrollPosition, setScrollPosition])

  return (
    <StatusBar sidebar>
      <div className={styles.sidebar} ref={scrollRef}>
        {isMobile && <div className={styles.statusBar} />}
        <h3>Messages</h3>
        <NewConversation />
        <div className={styles.list}>
          <Suspense fallback={<ConversationsPlaceholder />}>
            <ConversationCardList />
          </Suspense>
        </div>
      </div>
    </StatusBar>
  )
}

export default ConversationList
