import { FC, useMemo, useCallback, Suspense, memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronRight,
  faCopy,
  faSignOutAlt,
  faTrashAlt,
  faUserFriends
} from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQueries } from 'react-query'
import { clientGateway } from '../utils/constants'
import styles from './ConversationCard.module.scss'
import { Auth } from '../authentication/state'
import { getUser, State } from '../user/remote'
import { Clipboard } from '@capacitor/core'
import Context from '../components/Context'
import { ContextMenuItems } from '../state/ui'
import { useSuspenseStorageItem } from '../utils/storage'
import { Keychain } from '../keychain/state'
import { useChannel } from '../chat/state'
import { useConversation, useConversationMembers } from './state'
import { useMatch, useNavigate } from 'react-location'
import { ConversationType } from './remote'
import Avatar from '../components/Avatar'

const ConversationCardView: FC<{
  conversationID: string
  lastMessageID?: string
  channelID?: string
}> = memo(({ conversationID, lastMessageID, channelID }) => {
  const {
    params: { id }
  } = useMatch()
  const conversation = useConversation(conversationID)
  const conversationMembers = useConversationMembers(conversationID)
  const navigate = useNavigate()
  const { token, id: userID } = Auth.useContainer()
  const channel = useChannel(channelID)
  const leaveConversation = useMutation(
    async () =>
      await clientGateway.delete(`/conversations/${conversationID}`, {
        headers: { Authorization: token }
      })
  )
  const [, setLastConversation] = useSuspenseStorageItem('last-conversation')

  // const { data: message } = useQuery(
  //   ['message', lastMessageID, token],
  //   getMessage
  // )

  const { keychain } = Keychain.useContainer()
  // const { data: otherKeychain } = useQuery(
  //   ['keychain', message?.author_id, token],
  //   getKeychain
  // )
  // const { data: otherPublicKey } = useQuery(
  //   ['publicKey', otherKeychain?.signing.publicKey],
  //   async (_: string, key: number[]) => {
  //     if (!key) return undefined
  //     return await importPublicKey(key, 'signing')
  //   }
  // )

  // const { data: messageContent } = useQuery(
  //   [
  //     'messageContent',
  //     message?.content ??
  //       (message?.author_id === id
  //         ? message.self_encrypted_content
  //         : message?.encrypted_content),
  //     otherPublicKey,
  //     keychain
  //   ],
  //   async () => {
  //     const content =
  //       message?.content ??
  //       (message?.author_id === id
  //         ? message.self_encrypted_content
  //         : message?.encrypted_content)
  //     if (typeof content === 'string') {
  //       return content
  //     } else {
  //       if (!otherPublicKey || !keychain || !content) return ''
  //       try {
  //         const decrypted = await decryptMessage(
  //           keychain,
  //           otherPublicKey,
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

  // const unreads = useQuery(['unreads', id, token], getUnreads)
  // const mentions = useQuery(['mentions', id, token], getMentions)

  // const mentionsCount = useMemo(
  //   () => mentions.data?.[channelID]?.filter((mention) => !mention.read).length,
  //   [mentions, channelID]
  // )

  const getItems = useCallback(() => {
    const items: ContextMenuItems = [
      {
        text: 'Copy ID',
        icon: faCopy,
        danger: false,
        onClick: async () => {
          await Clipboard.write({
            string: conversationID
          })
        }
      }
    ]

    // if (
    //   unreads?.data?.[channelID]?.last_message_id !==
    //   unreads?.data?.[channelID]?.read
    // ) {
    //   items.push({
    //     text: 'Mark as Read',
    //     icon: faGlasses,
    //     danger: false,
    //     onClick: async () => {
    //       if (!channel.data) return
    //       const channelId = channel.data.id

    //       await clientGateway.post(
    //         `/channels/${channelId}/read`,
    //         {},
    //         {
    //           headers: {
    //             Authorization: token
    //           }
    //         }
    //       )
    //       // TODO: Maybe we want to push a gateway event instead?
    //       queryClient.setQueryData(['unreads', id, token], (initial: any) => ({
    //         ...initial,
    //         [channelId]: {
    //           ...initial[channelId],
    //           read: initial[channelId].last_message_id
    //         }
    //       }))

    //       const initialMentions = queryClient.getQueryData<Mentions>([
    //         'mentions',
    //         id,
    //         token
    //       ])

    //       if (initialMentions) {
    //         queryClient.setQueryData(['mentions', id, token], {
    //           ...initialMentions,
    //           [channelId]: initialMentions[channelId]?.map((m) => ({
    //             ...m,
    //             read: true
    //           }))
    //         })
    //       }
    //     }
    //   })
    // }

    items.push({
      text:
        (conversationMembers?.length ?? 1) === 1
          ? 'Delete Conversation'
          : 'Leave Conversation',
      icon:
        (conversationMembers?.length ?? 1) === 1 ? faTrashAlt : faSignOutAlt,
      danger: true,
      onClick: (event) => {
        if (id === conversationID) navigate({ to: '/app/conversations' })
        event?.stopPropagation()
        leaveConversation.mutate()
      }
    })
    return items
  }, [
    channel,
    conversationID,
    history,
    leaveConversation,
    id,
    token,
    // unreads.data,
    channelID,
    id,
    conversationMembers?.length
  ])

  // const output = useMarkdown(messageContent || '', {
  //   bold: (str, key) => <strong key={key}>{str}</strong>,
  //   italic: (str, key) => <i key={key}>{str}</i>,
  //   underlined: (str, key) => <u key={key}>{str}</u>,
  //   strikethough: (str, key) => <del key={key}>{str}</del>,
  //   link: (str, key) => {
  //     return (
  //       <span key={key} className={styles.link}>
  //         {str}
  //       </span>
  //     )
  //   },
  //   codeblock: (str, key) => <code key={key}>{str}</code>,
  //   custom: [
  //     [
  //       /<@([A-Za-z0-9-]+?)>/g,
  //       (str, key) => (
  //         <span key={key}>
  //           <ErrorBoundary fallbackRender={() => <span>&lt;@{str}&gt;</span>}>
  //             <Suspense fallback={<span>&lt;@{str}&gt;</span>}>
  //               <Mention.User
  //                 selected={match?.params.id === conversationID}
  //                 userID={str}
  //               />
  //             </Suspense>
  //           </ErrorBoundary>
  //         </span>
  //       )
  //     ],
  //     [
  //       /<#([A-Za-z0-9-]+?)>/g,
  //       (str, key) => (
  //         <span key={key}>
  //           <ErrorBoundary fallbackRender={() => <span>&lt;@{str}&gt;</span>}>
  //             <Suspense fallback={<span>&lt;@{str}&gt;</span>}>
  //               <Mention.Channel
  //                 selected={match?.params.id === conversationID}
  //                 channelID={str}
  //               />
  //             </Suspense>
  //           </ErrorBoundary>
  //         </span>
  //       )
  //     ]
  //   ]
  // })

  const users = useQueries(
    (conversationMembers ?? []).map((member) => {
      return {
        queryKey: ['user', member.userID, token],
        queryFn: async () => getUser(member.userID, token!)
      }
    })
  )

  const conversationName = useMemo(() => {
    if (conversation?.type === ConversationType.DM)
      return users.filter(({ data: user }) => user?.id !== userID)[0]?.data
        ?.username
    else return users?.map(({ data: user }) => user?.username).join(', ')
  }, [conversation, users])

  const conversationIcon = useMemo(() => {
    if (conversation?.type === ConversationType.DM) {
      const user = users.filter(({ data: user }) => user?.id !== userID)[0]
        ?.data

      return (
        <>
          <Avatar
            size='conversation'
            username={user?.username ?? ''}
            avatar={user?.avatar}
          />
          {users?.[0].data?.state && (
            <div
              className={`${styles.badge} ${
                user?.state === State.online
                  ? styles.online
                  : user?.state === State.dnd
                  ? styles.dnd
                  : user?.state === State.idle
                  ? styles.idle
                  : user?.state === State.offline
                  ? styles.offline
                  : ''
              } ${id === conversationID ? styles.selectedBadge : ''}`}
            />
          )}
        </>
      )
    } else
      return (
        <div className={styles.groupIcon}>
          <FontAwesomeIcon icon={faUserFriends} />
        </div>
      )
  }, [conversation, users])

  return (
    <Context.Wrapper
      title={users?.map(({ data: user }) => user?.username).join(', ') || ''}
      message={
        (conversationMembers?.length ?? 1) === 1
          ? users?.[0]?.status
          : 'Group Chat'
      }
      items={getItems()}
    >
      <div
        className={`${styles.card} ${
          id === conversationID ? styles.selected : ''
        }`}
        onClick={() => {
          if (id === conversationID) return
          navigate({ to: `/app/conversations/${conversationID}` })
          setLastConversation(conversationID)
        }}
      >
        <div className={styles.avatar} key='avatar'>
          {conversationIcon}
        </div>
        <div className={styles.user} key='user'>
          <h4>{conversationName}</h4>
          {/* {output && (
            <p>
              {message?.author_id === id
                ? 'You: '
                : (people?.length ?? 1) === 1
                ? ''
                : message?.type === MessageTypes.NORMAL
                ? `${
                    users?.find(({data: user}) => user?.id === message?.author_id)
                      ?.data?.username ?? 'Unknown'
                  }: `
                : ''}
              {output}
            </p>
          )} */}
        </div>
        <div className={styles.details} key='details'>
          {/* {match?.params.id !== conversationID &&
            (mentionsCount && mentionsCount > 0 ? (
              <div
                className={`${styles.mention} ${
                  mentionsCount > 9 ? styles.pill : ''
                }`}
              >
                <span>{mentionsCount > 999 ? '999+' : mentionsCount}</span>
              </div>
            ) : unreads?.data?.[channelID]?.last_message_id !==
              unreads?.data?.[channelID]?.read ? (
              <div className={styles.unread} />
            ) : (
              <></>
            ))} */}
          <FontAwesomeIcon icon={faChevronRight} fixedWidth />
        </div>
      </div>
    </Context.Wrapper>
  )
})

const ConversationCardPlaceholder: FC = () => {
  const username = useMemo(() => Math.floor(Math.random() * 5) + 3, [])
  const status = useMemo(() => Math.floor(Math.random() * 6) + 3, [])
  return (
    <div className={styles.placeholder}>
      <div className={styles.avatar} key='avatar' />
      <div className={styles.user} key='user'>
        <div
          className={styles.username}
          key='username'
          style={{ width: `${username}rem` }}
        />
        <div
          className={styles.status}
          key='status'
          style={{ width: `${status}rem` }}
        />
      </div>
    </div>
  )
}

const ConversationCard = {
  View: ConversationCardView,
  Placeholder: ConversationCardPlaceholder
}

export default ConversationCard
