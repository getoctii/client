import { useEffect, useRef, useCallback, useMemo, FC, Suspense } from 'react'
import { useInfiniteQuery } from 'react-query'
import { Auth } from '@/state/auth'
import { Message } from '@/domain/Chat'
import dayjs from 'dayjs'
import dayjsUTC from 'dayjs/plugin/utc'
import { Waypoint } from 'react-waypoint'
import { getMessages, MessageResponse } from '@/api/messages'
import { Chat } from '@/state/chat'
import { Keychain } from '@/state/keychain'
import {
  StyledMessages,
  StyledMessagesBuffer,
  StyledMessagesTop,
  StyledMessagesWaypoint
} from './Messages.style'

dayjs.extend(dayjsUTC)

const MessagesView: FC<{ channelID: string; conversationID?: string }> = ({
  channelID,
  conversationID
}) => {
  const {
    tracking,
    setTracking,
    editingMessageID,
    autoRead,
    setAutoRead,
    setChannelID
  } = Chat.useContainerSelector(
    ({
      tracking,
      setTracking,
      editingMessageID,
      autoRead,
      setAutoRead,
      setChannelID
    }) => ({
      tracking,
      setTracking,
      editingMessageID,
      autoRead,
      setAutoRead,
      setChannelID
    })
  )
  const { keychain } = Keychain.useContainer()

  useEffect(() => {
    setChannelID(channelID)
    setAutoRead(true)
    setTracking(true)
  }, [setAutoRead, setTracking, setChannelID, channelID])

  const { token, id } = Auth.useContainer()
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<MessageResponse[], any>(
      ['messages', channelID, token],
      async ({ pageParam }) =>
        (await getMessages(channelID, token!, pageParam)).reverse(),
      {
        getNextPageParam: (last) => {
          return last.length < 25 ? undefined : last[last.length - 1].id
        }
      }
    )

  const messages = useMemo(() => data?.pages?.flat(), [data])

  const isPrimary = useCallback(
    (message: MessageResponse, index: number) => {
      return !(
        messages?.[index + 1] &&
        message.authorID === messages?.[index + 1]?.authorID &&
        // message.type === messages?.[index + 1]?.type &&
        'content' in message.payload ===
          'content' in messages?.[index + 1].payload &&
        dayjs.utc(message?.createdAt)?.valueOf() -
          dayjs.utc(messages?.[index - 1]?.createdAt)?.valueOf() <
          300000
      )
    },
    [messages]
  )

  const ref = useRef<HTMLDivElement>(null)
  const trackingRef = useRef(tracking)

  useEffect(() => {
    trackingRef.current = tracking
  }, [tracking])

  // const unreads = useQuery(['unreads', id, token], getUnreads)

  // const setAsRead = useCallback(async () => {
  //   if (
  //     tracking &&
  //     messages &&
  //     unreads.data &&
  //     unreads.data[channel.id] &&
  //     messages[0]?.id !== unreads.data[channel.id].read
  //   ) {
  //     await clientGateway.post(
  //       `/channels/${channel.id}/read`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: token
  //         }
  //       }
  //     )
  //     // TODO: Maybe we want to push a gateway event instead?
  //     queryClient.setQueryData(['unreads', id, token], (initial: any) => ({
  //       ...initial,
  //       [channel.id]: {
  //         ...initial[channel.id],
  //         read: messages[0]?.id
  //       }
  //     }))

  //     const initialMentions = queryClient.getQueryData<Mentions>([
  //       'mentions',
  //       id,
  //       token
  //     ])

  //     if (initialMentions) {
  //       queryClient.setQueryData(['mentions', id, token], {
  //         ...initialMentions,
  //         [channel.id]: initialMentions[channel.id]?.map((m) => ({
  //           ...m,
  //           read: true
  //         }))
  //       })
  //     }
  //   }
  // }, [tracking, messages, channel, token, unreads, id])

  // const setAsReadHack = useRef(setAsRead)

  // useEffect(() => {
  //   setAsReadHack.current = setAsRead
  // }, [setAsRead])
  // useEffect(
  //   () => () => {
  //     setAsReadHack.current()
  //   },
  //   []
  // )
  // useDebounce(
  //   async () => {
  //     if (autoRead) await setAsRead()
  //   },
  //   500,
  //   [setAsRead, autoRead]
  // )

  const length = useMemo(() => Math.floor(Math.random() * 10) + 8, [])

  // if (!keychain)
  //   return (
  //     <div key={channelID} className={styles.noKeychain}>
  //       {!hasKeychain ? (
  //         <>
  //           <FontAwesomeIcon icon={faExclamationTriangle} size='2x' />
  //           <h1>No Keychain Found</h1>
  //           <h2>Please generate one in settings</h2>
  //         </>
  //       ) : (
  //         <></>
  //       )}
  //     </div>
  //   )
  return (
    <StyledMessages key={channelID} ref={ref}>
      <StyledMessagesBuffer key='buffer' />
      <Waypoint
        topOffset={5}
        onEnter={() => setTracking(true)}
        onLeave={() => setTracking(false)}
      />
      {messages?.map((message, index) =>
        message ? (
          <Suspense key={message.id} fallback={<Message.Placeholder />}>
            {/* {unreads.data &&
              unreads.data[channel.id]?.read === message.id &&
              unreads.data[channel.id]?.read !== messages[0]?.id && (
                <div key={`read-${message.id}`} className={styles.indicator}>
                  <hr />
                  <span>Last Read</span>
                </div>
              )} */}
            <Message.View
              key={message.id}
              primary={isPrimary(message, index)}
              id={message.id}
              // type={message.type}
              authorID={message.authorID}
              createdAt={message.createdAt}
              payload={message.payload}
              updatedAt={message.updatedAt}
              conversationID={conversationID}
              // richContent={message.rich_content}
            />
          </Suspense>
        ) : (
          <></>
        )
      )}
      {!hasNextPage ? (
        <StyledMessagesTop key='header'>
          <h3>
            Woah, you reached the top of the chat. Here's a cookie{' '}
            <span role='img' aria-label='Cookie'>
              🍪
            </span>
          </h3>
        </StyledMessagesTop>
      ) : (
        <></>
      )}
      {isFetchingNextPage &&
        Array(length)
          .fill(0)
          .map((_, index) => <Message.Placeholder key={index} />)}
      {isFetchingNextPage && hasNextPage ? (
        <StyledMessagesWaypoint>
          <Waypoint
            onEnter={async () => {
              await fetchNextPage()
            }}
            bottomOffset={30}
          >
            <StyledMessagesWaypoint />
          </Waypoint>
        </StyledMessagesWaypoint>
      ) : (
        <></>
      )}
    </StyledMessages>
  )
}

const MessagesPlaceholder: FC = () => {
  const length = useMemo(() => Math.floor(Math.random() * 10) + 8, [])
  return (
    <StyledMessages>
      {Array.from(Array(length).fill(0).keys()).map((_, index) => (
        <Message.Placeholder key={index} />
      ))}
    </StyledMessages>
  )
}

const Messages = { View: MessagesView, Placeholder: MessagesPlaceholder }

export default Messages
