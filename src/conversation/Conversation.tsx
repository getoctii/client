import { FC, Suspense, useEffect, useMemo } from 'react'
import styles from './Conversation.module.scss'
import Chat from '../chat/Channel'
import { Redirect, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { Auth } from '../authentication/state'
import { useQuery } from 'react-query'
import { InternalChannelTypes } from '../utils/constants'
import { Conversations } from './Conversations'
import { useLocation, useMedia } from 'react-use'
import Empty from './empty/Empty'
import Sidebar from '../sidebar/Sidebar'
import dayjs from 'dayjs'
import { useSuspenseStorageItem } from '../utils/storage'
import { Helmet } from 'react-helmet-async'
import { Permission } from '../utils/permissions'
import { PrivateRoute } from '../authentication/PrivateRoute'
import { useConversation, useConversationMembers } from './state'
import { useConversations } from '../user/state'

const ConversationView: FC = () => {
  const match = useRouteMatch<{ id: string }>('/conversations/:id')
  const { id, token } = Auth.useContainer()
  const conversation = useConversation(match?.params.id)
  const members = useConversationMembers(match?.params.id)
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
          conversationID={match?.params.id}
          members={people}
          key={conversation.channelID}
          voiceChannelID={''}
        />
      </div>
    </Suspense>
  )
}

const ConversationProvider: FC = () => {
  const { id, token } = Auth.useContainer()
  const [lastConversation] = useSuspenseStorageItem<string>('last-conversation')
  const match = useRouteMatch<{ id: string }>('/conversations/:id')

  const history = useHistory()
  const isMobile = useMedia('(max-width: 740px)')
  const conversations = useConversations()

  useEffect(() => {
    if (!match?.params.id && conversations.length > 0 && !isMobile) {
      history.push(
        `/conversations/${
          lastConversation &&
          conversations.find(
            (conversation) => conversation === lastConversation
          )
            ? lastConversation
            : conversations[0]
        }`
      )
    } else if (
      match?.params.id &&
      conversations.length === 0 &&
      conversations.find((conversation) => conversation !== match.params.id)
    ) {
      history.push('/')
    } else if (
      match?.params.id &&
      conversations.length > 0 &&
      !conversations.find((conversation) => conversation === match.params.id)
    ) {
      history.push(`/conversations/${conversations[0]}`)
    }
  }, [conversations, isMobile, lastConversation, match?.params.id, history])

  return (
    <>
      {match &&
      conversations?.find(
        (conversation) => conversation === match.params.id
      ) ? (
        <Permission.Provider>
          <ConversationView />
        </Permission.Provider>
      ) : isMobile ? (
        <>
          <Sidebar />
          <Conversations />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

const Redirects: FC = () => {
  const { id, token } = Auth.useContainer()
  const { path } = useRouteMatch()
  const conversations = useConversations()
  const isMobile = useMedia('(max-width: 740px)')

  const location = useLocation()

  if (!conversations) return <></>

  if (conversations.length === 0 && location.pathname !== `${path}/empty`)
    return <Redirect to={`${path}/empty`} />

  if (
    conversations.length > 0 &&
    !isMobile &&
    (location.pathname === path || location.pathname === `${path}/empty`)
  )
    return <Redirect to={`${path}/${conversations?.[0]}`} />
  return <></>
}

const Nested: FC = () => {
  const { path } = useRouteMatch()
  const isMobile = useMedia('(max-width: 740px)')
  return (
    <>
      {!isMobile && <Conversations />}
      <Suspense fallback={<Chat.Placeholder />}>
        <Switch>
          <PrivateRoute
            path={`${path}/:id`}
            component={ConversationProvider}
            exact
          />
          {isMobile && (
            <PrivateRoute
              path={path}
              exact
              component={() => (
                <>
                  <Sidebar />
                  <Conversations />
                </>
              )}
            />
          )}
        </Switch>
      </Suspense>
    </>
  )
}

const ConversationRouter: FC = () => {
  const { path } = useRouteMatch()
  const isMobile = useMedia('(max-width: 740px)')

  return (
    <>
      <Redirects />
      <Switch>
        <PrivateRoute
          render={() => (
            <>
              {isMobile && <Sidebar />}
              <Empty />
            </>
          )}
          path={`${path}/empty`}
        />
        <Nested />
      </Switch>
    </>
  )
}

export default ConversationRouter
