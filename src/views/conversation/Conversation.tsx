import { FC, Suspense, useEffect, useMemo } from 'react'
import styles from './Conversation.module.scss'
import Chat from '../chat/Channel'
import { Redirect, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { Auth } from '@/state/auth'
import { useQuery } from 'react-query'
import { InternalChannelTypes } from '../../utils/constants'
import { useLocation, useMedia } from 'react-use'
import { SideBar } from '@/components/Layout'
import dayjs from 'dayjs'
import { useSuspenseStorageItem } from '../../utils/storage'
import { Helmet } from 'react-helmet-async'
import { Permission } from '../../utils/permissions'
import { PrivateRoute } from '../authentication/PrivateRoute'
import { useConversation, useConversationMembers } from '@/hooks/conversations'
import { useConversations } from '@/hooks/users'
import { useMatch } from 'react-location'

const Conversation: FC = () => {
  const {
    params: { id: conversationID }
  } = useMatch()
  const { id, token } = Auth.useContainer()
  const conversation = useConversation(conversationID)
  const members = useConversationMembers(conversationID)
  const people = useMemo(
    () => members.filter((member) => member.userID !== id),
    [members, id]
  )

  if (!conversation) return <></>

  return (
    <Suspense fallback={<Chat.Placeholder />}>
      <Helmet>
        <title>Octii - Messages</title>
      </Helmet>
      <div className={styles.conversation} key={conversation.channelID}>
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
      </div>
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
