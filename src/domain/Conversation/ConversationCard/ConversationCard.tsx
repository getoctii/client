import { FC, useMemo, useCallback, memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronRight,
  faCopy,
  faSignOutAlt,
  faTrashAlt,
  faUserFriends
} from '@fortawesome/pro-solid-svg-icons'
import { useMutation, useQueries } from 'react-query'
import { clientGateway } from '@/utils/constants'
import styles from './ConversationCard.module.scss'
import { Auth } from '@/state/auth'
import { getUser, State } from '@/api/users'
import { ContextMenu } from '@/components/Overlay'
import { ContextMenuItems } from '@/state/ui'
import { useSuspenseStorageItem } from '@/utils/storage'
import { Keychain } from '@/state/keychain'
import { useChannel, useDecryptMessage, useMessage } from '@/hooks/messages'
import { useConversation, useConversationMembers } from '@/hooks/conversations'
import { useMatch, useMatchRoute, useNavigate } from 'react-location'
import { ConversationType } from '@/api/conversations'
import Avatar from '@/components/Avatar/Avatar'
import { SignedMessage, SigningPair } from '@innatical/inncryption'
import { useCurrentUser } from '@/hooks/users'
import useMarkdown from '@innatical/markdown'

const ConversationCardView: FC<{
  conversationID: string
  channelID?: string
}> = memo(({ conversationID, channelID }) => {
  const {
    params: { id }
  } = useMatch()
  const matchRoute = useMatchRoute()
  const conversation = useConversation(conversationID)
  const conversationMembers = useConversationMembers(conversationID)
  const navigate = useNavigate()
  const { token, id: userID } = Auth.useContainer()
  const channel = useChannel(channelID)
  const leaveConversation = useMutation(
    async () =>
      await clientGateway.post(
        `/conversations/${conversationID}/leave`,
        {},
        {
          headers: { Authorization: token }
        }
      )
  )
  const [, setLastConversation] = useSuspenseStorageItem('last-conversation')

  const { keychain } = Keychain.useContainer()
  const user = useCurrentUser()
  const message = useMessage(channel?.lastMessageID)
  const messageContent = useDecryptMessage({
    id: message?.id,
    authorID: message?.authorID,
    payload: message?.payload,
    conversationID: conversationID
  })

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
          await navigator.clipboard.writeText(conversationID)
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
        conversation?.type === ConversationType.DM
          ? 'Delete Conversation'
          : 'Leave Conversation',
      icon:
        conversation?.type === ConversationType.DM ? faTrashAlt : faSignOutAlt,
      danger: true,
      onClick: (event) => {
        if (matchRoute({ to: `/app/conversations/${conversationID}` }))
          navigate({ to: '/app/conversations' })
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

  const output = useMarkdown(messageContent || '', {
    bold: (str, key) => <strong key={key}>{str}</strong>,
    italic: (str, key) => <i key={key}>{str}</i>,
    underlined: (str, key) => <u key={key}>{str}</u>,
    strikethough: (str, key) => <del key={key}>{str}</del>,
    link: (str, key) => {
      return (
        <span key={key} className={styles.link}>
          {str}
        </span>
      )
    },
    codeblock: (str, key) => <code key={key}>{str}</code>,
    custom: []
  })

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
      return users.length > 0
        ? users.filter(({ data: user }) => user?.id !== userID)[0]?.data
            ?.username
        : 'Empty Group'
    else
      return (
        conversation?.name ??
        (users.filter(({ data: user }) => user?.id !== userID).length > 0
          ? users
              .filter(({ data: user }) => user?.id !== userID)
              ?.map(({ data: user }) => user?.username)
              .join(', ')
          : 'Empty Group')
      )
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
                user?.state === State.ONLINE
                  ? styles.online
                  : user?.state === State.DND
                  ? styles.dnd
                  : user?.state === State.IDLE
                  ? styles.idle
                  : user?.state === State.OFFLINE
                  ? styles.offline
                  : ''
              } ${
                matchRoute({ to: `/app/conversations/${conversationID}` })
                  ? styles.selectedBadge
                  : ''
              }`}
            />
          )}
        </>
      )
    } else
      return (
        <Avatar username={conversationID} size='conversation'>
          <FontAwesomeIcon icon={faUserFriends} />
        </Avatar>
      )
  }, [conversation, users])
  return (
    <ContextMenu.Wrapper
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
          matchRoute({ to: `/app/conversations/${conversationID}` })
            ? styles.selected
            : ''
        }`}
        onClick={() => {
          if (matchRoute({ to: `/app/conversations/${conversationID}` })) return
          navigate({ to: `/app/conversations/${conversationID}` })
          setLastConversation(conversationID)
        }}
      >
        <div className={styles.avatar} key='avatar'>
          {conversationIcon}
        </div>
        <div className={styles.user} key='user'>
          <h4>{conversationName}</h4>
          {output && <p>{output}</p>}
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
    </ContextMenu.Wrapper>
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
