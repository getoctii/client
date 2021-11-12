import {
  memo,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  FC
} from 'react'
import styles from './Conversations.module.scss'
import { Auth } from '../authentication/state'
import ConversationCard from './ConversationCard'
import { useRouteMatch } from 'react-router-dom'
import { useMedia, useScroll } from 'react-use'
import NewConversation from './NewConversation'
import dayjs from 'dayjs'
import dayjsUTC from 'dayjs/plugin/utc'
import { ScrollPosition } from '../state/scroll'
import StatusBar from '../components/StatusBar'
import { useConversations } from '../user/state'
import { useConversation } from './state'
import { useMatch } from 'react-location'

dayjs.extend(dayjsUTC)

const ConversationCardWrapper: FC<{ index: number; conversationID: string }> =
  ({ conversationID, index }) => {
    const {
      params: { id }
    } = useMatch()
    const conversation = useConversation(conversationID)
    return (
      <div key={conversationID}>
        {index !== 0 && (
          <hr className={id === conversationID ? styles.hidden : ''} />
        )}
        <Suspense fallback={<ConversationCard.Placeholder />}>
          <ConversationCard.View
            conversationID={conversationID}
            lastMessageID={''}
            channelID={conversation?.channelID}
          />
        </Suspense>
      </div>
    )
  }

const ConversationList: FC = memo(() => {
  const auth = Auth.useContainer()
  const conversations = useConversations()

  return (
    <>
      {conversations && conversations.length > 0 ? (
        conversations.map((conversation, index) => {
          return (
            <ConversationCardWrapper
              conversationID={conversation}
              index={index}
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
          <ConversationCard.Placeholder key={index} />
        </>
      ))}
    </>
  )
}

export const Conversations: FC = () => {
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
            <ConversationList />
          </Suspense>
        </div>
      </div>
    </StatusBar>
  )
}
