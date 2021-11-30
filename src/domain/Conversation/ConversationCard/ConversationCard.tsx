import { FC, useMemo, memo } from 'react'
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
import { Auth } from '@/state/auth'
import { getUser } from '@/api/users'
import { ContextMenu } from '@/components/Overlay'
import { ContextMenuItems } from '@/state/ui'
import { useSuspenseStorageItem } from '@/utils/storage'
import { useChannel, useDecryptMessage, useMessage } from '@/hooks/messages'
import { useConversation, useConversationMembers } from '@/hooks/conversations'
import { useMatch, useMatchRoute, useNavigate } from 'react-location'
import { ConversationType } from '@/api/conversations'
import Avatar from '@/components/Avatar/Avatar'
import useMarkdown from '@innatical/markdown'
import {
  StyledConversationCard,
  StyledConversationCardAvatar,
  StyledConversationCardDetails,
  StyledConversationCardLink,
  StyledConversationCardPlaceholder,
  StyledConversationCardPlaceholderAvatar,
  StyledConversationCardPlaceholderStatus,
  StyledConversationCardPlaceholderUser,
  StyledConversationCardPlaceholderUsername,
  StyledConversationCardUser
} from './ConversationCard.style'
import { StyledIconBadge } from '@/domain/User/Icon/Icon.style'

const ConversationCard: FC<{
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

  const message = useMessage(channel?.lastMessageID)
  const messageContent = useDecryptMessage({
    id: message?.id,
    authorID: message?.authorID,
    payload: message?.payload,
    conversationID: conversationID
  })

  const items = useMemo(() => {
    const contextMenuItems: ContextMenuItems = [
      {
        text: 'Copy ID',
        icon: faCopy,
        danger: false,
        onClick: async () => {
          await navigator.clipboard.writeText(conversationID)
        }
      }
    ]

    contextMenuItems.push({
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
    return contextMenuItems
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
        <StyledConversationCardLink key={key}>{str}</StyledConversationCardLink>
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
            <StyledIconBadge
              state={user?.state}
              selected={
                !!matchRoute({ to: `/app/conversations/${conversationID}` })
              }
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
      items={items}
    >
      <StyledConversationCard
        selected={!!matchRoute({ to: `/app/conversations/${conversationID}` })}
        onClick={() => {
          if (matchRoute({ to: `/app/conversations/${conversationID}` })) return
          navigate({ to: `/app/conversations/${conversationID}` })
          setLastConversation(conversationID)
        }}
      >
        <StyledConversationCardAvatar key='avatar'>
          {conversationIcon}
        </StyledConversationCardAvatar>
        <StyledConversationCardUser key='user'>
          <h4>{conversationName}</h4>
          {output && <p>{output}</p>}
        </StyledConversationCardUser>
        <StyledConversationCardDetails key='details'>
          <FontAwesomeIcon icon={faChevronRight} fixedWidth />
        </StyledConversationCardDetails>
      </StyledConversationCard>
    </ContextMenu.Wrapper>
  )
})

export const ConversationCardPlaceholder: FC = () => {
  const username = useMemo(() => Math.floor(Math.random() * 5) + 3, [])
  const status = useMemo(() => Math.floor(Math.random() * 6) + 3, [])
  return (
    <StyledConversationCardPlaceholder>
      <StyledConversationCardPlaceholderAvatar key='avatar' />
      <StyledConversationCardPlaceholderUser key='user'>
        <StyledConversationCardPlaceholderUsername
          key='username'
          style={{ width: `${username}rem` }}
        />
        <StyledConversationCardPlaceholderStatus
          key='status'
          style={{ width: `${status}rem` }}
        />
      </StyledConversationCardPlaceholderUser>
    </StyledConversationCardPlaceholder>
  )
}
export default ConversationCard
