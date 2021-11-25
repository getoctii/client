import { FC, Suspense, useEffect, useMemo, useState } from 'react'
import Chat from '../chat/Channel'
import { Redirect, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { Auth } from '@/state/auth'
import { useQueries, useQuery } from 'react-query'
import { InternalChannelTypes } from '../../utils/constants'
import { useLocation, useMedia } from 'react-use'
import { SideBar } from '@/components/Layout'
import dayjs from 'dayjs'
import { useSuspenseStorageItem } from '../../utils/storage'
import { Helmet } from 'react-helmet-async'
import { Permission } from '../../utils/permissions'
import { PrivateRoute } from '../authentication/PrivateRoute'
import { useConversation, useConversationMembers } from '@/hooks/conversations'
import { useConversations, useUser } from '@/hooks/users'
import { useMatch, useNavigate } from 'react-location'
import { ContextMenu } from '@/components/Overlay'
import {
  ConversationMemberPermission,
  ConversationType,
  demoteConversationMember,
  editConversation,
  leaveConversation,
  promoteConversationMember,
  removeConversationMember
} from '@/api/conversations'
import {
  ConversationAction,
  ConversationActions,
  ConversationDetails,
  ConversationGroupType,
  ConversationInfo,
  ConversationMemberCard,
  ConversationMembers,
  ConversationName,
  ConversationWrapper,
  MemberDetails,
  MembersHeading,
  Seperator
} from './Conversation.style'
import Avatar from '@/components/Avatar/Avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCrown,
  faHammer,
  faPhone,
  faRunning,
  faUserCrown,
  faUserFriends,
  faUserPlus,
  faUserPolice,
  IconDefinition
} from '@fortawesome/pro-solid-svg-icons'
import { getUser } from '@/api/users'
import { AddMember } from '@/domain/Conversation'

const ConversationMember: FC<{
  id: string
  permission: ConversationMemberPermission
  isAdmin?: boolean
  isOwner?: boolean
  conversationID?: string
}> = ({ id, permission, isAdmin, isOwner, conversationID }) => {
  const { token } = Auth.useContainer()
  const user = useUser(id)

  const items = useMemo(() => {
    const items: {
      text: string
      icon: IconDefinition
      danger: boolean
      onClick: any
    }[] = []

    if (isOwner) {
      if (permission === ConversationMemberPermission.MEMBER) {
        items.push({
          text: 'Promote to Admin',
          icon: faUserPolice,
          danger: false,
          onClick: async () => {
            await promoteConversationMember(conversationID!, id, token!)
          }
        })
      }

      if (permission === ConversationMemberPermission.ADMINISTRATOR) {
        items.push({
          text: 'Demote to Member',
          icon: faUserPolice,
          danger: false,
          onClick: async () => {
            await demoteConversationMember(conversationID!, id, token!)
          }
        })
      }
    }
    if (
      (permission === ConversationMemberPermission.MEMBER &&
        (isAdmin || isOwner)) ||
      (permission === ConversationMemberPermission.ADMINISTRATOR && isOwner)
    ) {
      items.push({
        text: 'Kick Member',
        icon: faHammer,
        danger: true,
        onClick: async () => {
          await removeConversationMember(conversationID!, id, token!)
        }
      })
    }

    return items
  }, [permission, isAdmin, conversationID, token])

  return (
    <ContextMenu.Wrapper title='' items={items} disabled={items.length <= 0}>
      <ConversationMemberCard>
        <Avatar username={user?.username} avatar={user?.avatar} />
        <MemberDetails>
          <h1>
            {user?.username}{' '}
            {permission === ConversationMemberPermission.OWNER ? (
              <FontAwesomeIcon icon={faCrown} />
            ) : permission === ConversationMemberPermission.ADMINISTRATOR ? (
              <FontAwesomeIcon icon={faUserPolice} />
            ) : (
              <></>
            )}
          </h1>
          <p>{user?.status ?? 'Offline'}</p>
        </MemberDetails>
      </ConversationMemberCard>
    </ContextMenu.Wrapper>
  )
}
const Conversation: FC = () => {
  const {
    params: { id: conversationID }
  } = useMatch()
  const navigate = useNavigate()
  const { id, token } = Auth.useContainer()
  const conversation = useConversation(conversationID)
  const members = useConversationMembers(conversationID)
  const people = useMemo(
    () => members.filter((member) => member.userID !== id),
    [members, id]
  )
  const you = useMemo(
    () => members.find((member) => member.userID === id),
    [id, members]
  )

  const users = useQueries(
    (people ?? []).map((member) => {
      return {
        queryKey: ['user', member, token],
        queryFn: async () => getUser(member.userID, token!)
      }
    })
  )

  const [editingName, setEditingName] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const usernames = useMemo(
    () =>
      users.length > 0
        ? users.map(({ data: user }) => user?.username).join(', ')
        : 'Empty Group',
    [users]
  )
  const [conversationName, setConversationName] = useState(
    conversation?.name ?? usernames
  )
  useEffect(() => {
    if (!conversation?.name) setConversationName(usernames)
  }, [usernames])
  if (!conversation) return <></>

  return (
    <Suspense fallback={<Chat.Placeholder />}>
      <Helmet>
        <title>Octii - Messages</title>
      </Helmet>
      <ConversationWrapper key={conversation.channelID}>
        <Chat.View
          type={
            (people?.length ?? 0) > 1
              ? InternalChannelTypes.GroupChannel
              : InternalChannelTypes.PrivateChannel
          }
          channelID={conversation.channelID}
          conversationID={conversationID}
          members={people}
          key={conversation.channelID}
          voiceChannelID={''}
        />
        {conversation.type === ConversationType.GROUP && (
          <ConversationInfo>
            <ConversationDetails>
              <Avatar size='conversation' username={conversationID}>
                <FontAwesomeIcon icon={faUserFriends} />
              </Avatar>
              <ConversationName
                onClick={() => setEditingName(true)}
                editing={editingName}
                disabled={
                  you?.permission === ConversationMemberPermission.MEMBER
                }
                onBlur={async () => {
                  setEditingName(false)
                  await editConversation(
                    conversationID,
                    conversationName,
                    token!
                  )
                }}
                value={conversationName}
                onChange={(event) => setConversationName(event.target.value)}
              />
              <ConversationGroupType>Group Chat</ConversationGroupType>
              <ConversationActions>
                <ConversationAction primary>
                  <FontAwesomeIcon icon={faPhone} />
                </ConversationAction>
                <ConversationAction
                  danger
                  onClick={async () => {
                    await leaveConversation(conversationID, token!)
                    navigate({ to: '/app/conversations' })
                  }}
                >
                  <FontAwesomeIcon icon={faRunning} />
                </ConversationAction>
              </ConversationActions>
            </ConversationDetails>
            <Seperator />
            <ConversationMembers>
              <MembersHeading>
                {members.length} members{' '}
                {(you?.permission === ConversationMemberPermission.OWNER ||
                  you?.permission ===
                    ConversationMemberPermission.ADMINISTRATOR) && (
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    onClick={() => setShowAddMember(!showAddMember)}
                  />
                )}
                {showAddMember && (
                  <div>
                    <AddMember groupID={conversationID} />
                  </div>
                )}
              </MembersHeading>

              <div>
                {members.map((member) => (
                  <ConversationMember
                    key={member.userID}
                    id={member.userID}
                    conversationID={conversationID}
                    permission={member.permission}
                    isOwner={
                      you?.permission === ConversationMemberPermission.OWNER
                    }
                    isAdmin={
                      you?.permission ===
                      ConversationMemberPermission.ADMINISTRATOR
                    }
                  />
                ))}
              </div>
            </ConversationMembers>
          </ConversationInfo>
        )}
      </ConversationWrapper>
    </Suspense>
  )
}

export default Conversation

// const ConversationProvider: FC = () => {
//   const { id, token } = Auth.useContainer()
//   const [lastConversation] = useSuspenseStorageItem<string>('last-conversation')
//   const match = useRouteMatch<{ id: string }>('/conversations/:id')

//   const history = useHistory()
//   const isMobile = useMedia('(max-width: 740px)')
//   const conversations = useConversations()

//   useEffect(() => {
//     if (!match?.params.id && conversations.length > 0 && !isMobile) {
//       history.push(
//         `/conversations/${
//           lastConversation &&
//           conversations.find(
//             (conversation) => conversation === lastConversation
//           )
//             ? lastConversation
//             : conversations[0]
//         }`
//       )
//     } else if (
//       match?.params.id &&
//       conversations.length === 0 &&
//       conversations.find((conversation) => conversation !== match.params.id)
//     ) {
//       history.push('/')
//     } else if (
//       match?.params.id &&
//       conversations.length > 0 &&
//       !conversations.find((conversation) => conversation === match.params.id)
//     ) {
//       history.push(`/conversations/${conversations[0]}`)
//     }
//   }, [conversations, isMobile, lastConversation, match?.params.id, history])

//   return (
//     <>
//       {match &&
//       conversations?.find(
//         (conversation) => conversation === match.params.id
//       ) ? (
//         <Permission.Provider>
//           <ConversationView />
//         </Permission.Provider>
//       ) : isMobile ? (
//         <>
//           <SideBar />
//           <Conversations />
//         </>
//       ) : (
//         <></>
//       )}
//     </>
//   )
// }

// const Redirects: FC = () => {
//   const { id, token } = Auth.useContainer()
//   const { path } = useRouteMatch()
//   const conversations = useConversations()
//   const isMobile = useMedia('(max-width: 740px)')

//   const location = useLocation()

//   if (!conversations) return <></>

//   if (conversations.length === 0 && location.pathname !== `${path}/empty`)
//     return <Redirect to={`${path}/empty`} />

//   if (
//     conversations.length > 0 &&
//     !isMobile &&
//     (location.pathname === path || location.pathname === `${path}/empty`)
//   )
//     return <Redirect to={`${path}/${conversations?.[0]}`} />
//   return <></>
// }
