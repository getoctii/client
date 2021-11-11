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
import { useHistory, useRouteMatch } from 'react-router-dom'
import { getUser, State } from '../user/remote'
import { Clipboard } from '@capacitor/core'
import Context from '../components/Context'
import { ContextMenuItems } from '../state/ui'
import { useSuspenseStorageItem } from '../utils/storage'
import { Keychain } from '../keychain/state'
import { useChannel } from '../chat/state'
import { useConversationMembers } from './state'

const ConversationCardView: FC<{
  conversationID: string
  lastMessageID?: string
  channelID?: string
}> = memo(({ conversationID, lastMessageID, channelID }) => {
  const match = useRouteMatch<{ id: string }>('/conversations/:id')
  const conversationMembers = useConversationMembers(conversationID)
  const history = useHistory()
  const { token, id } = Auth.useContainer()
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
        if (match?.params.id === conversationID) history.push('/')
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
    match?.params.id,
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
          match?.params.id === conversationID ? styles.selected : ''
        }`}
        onClick={() => {
          if (match?.params.id === conversationID) return
          history.push(`/conversations/${conversationID}`)
          setLastConversation(conversationID)
        }}
      >
        <div className={styles.avatar} key='avatar'>
          {(conversationMembers?.length ?? 1) === 1 ? (
            <>
              <img
                src={users?.[0].data?.avatar}
                alt={users?.[0].data?.username}
              />
              {users?.[0].data?.state && (
                <div
                  className={`${styles.badge} ${
                    users?.[0].data?.state === State.online
                      ? styles.online
                      : users?.[0].data?.state === State.dnd
                      ? styles.dnd
                      : users?.[0].data?.state === State.idle
                      ? styles.idle
                      : users?.[0].data?.state === State.offline
                      ? styles.offline
                      : ''
                  } ${
                    match?.params.id === conversationID
                      ? styles.selectedBadge
                      : ''
                  }`}
                />
              )}
            </>
          ) : (
            <div className={styles.groupIcon}>
              <FontAwesomeIcon icon={faUserFriends} />
            </div>
          )}
        </div>
        <div className={styles.user} key='user'>
          <h4>
            {users?.map(({ data: user }, index) => user?.username).join(', ')}
          </h4>
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
