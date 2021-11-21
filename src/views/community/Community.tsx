import { FC, memo, Suspense, useCallback, useEffect, useState } from 'react'
import styles from './Community.module.scss'
import Chat from '../chat/Channel'
import { Redirect, Switch, useParams, useRouteMatch } from 'react-router-dom'
import { Auth } from '@/state/auth'
import { SideBar as Channels } from '@/domain/Community'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Settings from './settings/Settings'
import { CommunityResponse } from '@/api/communities'
import { PrivateRoute } from '../authentication/PrivateRoute'
import { useMedia } from 'react-use'
import { SideBar } from '@/components/Layout'
import Members from './integrations/Members'
import { ChannelTypes, Permissions } from '../../utils/constants'
import { Helmet } from 'react-helmet-async'
import { ErrorBoundary } from 'react-error-boundary'
import { faLock } from '@fortawesome/pro-solid-svg-icons'
import { CommunityEmpty } from '@/domain/Community'
import { Permission } from '../../utils/permissions'
import { useMemo } from 'react'
import { EditChannel } from '@/modals/Community'
import { List, Header } from '@/components/Layout'
import { Placeholder } from '@/components/Layout/Header/Header'
import { Error } from '@/components/Feedback'
import Products from './integrations/Products'
import Product from './integrations/product/Product'
import VoiceChannel from './voice/VoiceChannel'
import { useChannels, useCommunity } from '@/hooks/communities'
import { useChannel } from '@/hooks/messages'
import { useMatch } from 'react-location'

const NoPermission: FC<CommunityResponse> = ({ name }) => (
  <div className={styles.noPermission}>
    <Helmet>
      <title>Octii - {name}</title>
    </Helmet>
    <div className={styles.locked}>
      <FontAwesomeIcon icon={faLock} size='4x' />
      <small>{name}</small>
      <h3>You cannot view this community!</h3>
    </div>
  </div>
)

const Channel: FC = () => {
  const {
    params: { id, channelID }
  } = useMatch()
  const channel = useChannel(channelID)
  if (!channel) return <></>
  return channel.type === ChannelTypes.TEXT ? (
    <Chat.Community key={channel.id} />
  ) : channel.type === ChannelTypes.VOICE ? (
    <VoiceChannel channel={channel} />
  ) : (
    <></>
  )
}

const ListPlaceholder: FC = () => {
  return (
    <div className={styles.listPlaceholder}>
      <Placeholder />
      <List.Placeholder />
    </div>
  )
}

const CommunityPlaceholder: FC = () => {
  const isMobile = useMedia('(max-width: 740px)')
  const matchTab = useRouteMatch<{ id: string; tab: string }>(
    '/communities/:id/:tab'
  )
  return (
    <>
      <Channels.Placeholder />
      {!isMobile &&
        (matchTab?.params.tab === 'settings' ? (
          <Settings.Placeholder />
        ) : matchTab?.params.tab === 'members' ||
          matchTab?.params.tab === 'products' ? (
          <ListPlaceholder />
        ) : (
          <Chat.Placeholder />
        ))}
    </>
  )
}

const EmptyCommunityHandler: FC<{
  emptyStateChange: (state: boolean) => void
}> = ({ emptyStateChange }) => {
  const { token } = Auth.useContainer()
  const match = useRouteMatch<{ id: string }>('/communities/:id')
  const channels = useChannels()

  const showEmpty = useMemo(() => {
    return (
      (channels ?? []).filter((c) => c.type === ChannelTypes.TEXT).length <= 0
    )
  }, [channels])

  useEffect(() => {
    emptyStateChange(showEmpty)
  }, [showEmpty, emptyStateChange])

  return <></>
}

const CommunityChannelFallback: FC = () => {
  const match = useRouteMatch<{ id: string }>('/communities/:id')
  const channels = useChannels()
  const textChannels = useMemo(() => {
    return (channels ?? [])
      .filter((channel) => channel?.type === 1)
      .sort((a, b) => b.order - a.order)
  }, [channels])

  return textChannels.length > 0 ? (
    <Redirect
      path='*'
      to={`/communities/${match?.params.id}/channels/${textChannels[0].id}`}
    />
  ) : (
    <></>
  )
}

const CommunityView: FC = () => {
  const { path } = useRouteMatch()
  const match = useRouteMatch<{ id: string }>('/communities/:id')
  const matchTab = useRouteMatch<{ id: string; tab: string }>(
    '/communities/:id/:tab'
  )
  const isMobile = useMedia('(max-width: 740px)')
  const { hasPermissions } = Permission.useContainer()

  const community = useCommunity()
  const [showEmpty, setShowEmpty] = useState(false)

  const emptyHandler = useCallback((state: boolean) => {
    setShowEmpty(state)
  }, [])

  if (!community) return <></>

  if (!hasPermissions([Permissions.READ_MESSAGES])) {
    return <NoPermission {...community} />
  }
  return (
    <>
      <EmptyCommunityHandler emptyStateChange={emptyHandler} />
      {showEmpty ? (
        <EmptyCommunity {...community} />
      ) : (
        <div className={styles.community} key={match?.params.id}>
          <Helmet>
            <title>Octii - {community.name}</title>
          </Helmet>
          {isMobile && !matchTab ? (
            <Channels.View />
          ) : !isMobile ? (
            <Channels.View />
          ) : (
            <></>
          )}
          <Suspense
            fallback={
              matchTab?.params.tab === 'settings' ? (
                <Settings.Placeholder />
              ) : matchTab?.params.tab === 'members' ||
                matchTab?.params.tab === 'products' ? (
                <ListPlaceholder />
              ) : (
                <Chat.Placeholder />
              )
            }
          >
            <Switch>
              <PrivateRoute
                path={`${path}/products/:productID`}
                render={Product}
              />
              <PrivateRoute path={`${path}/products`} render={Products} exact />

              <PrivateRoute
                path={`${path}/settings/:tab?`}
                render={Settings.Router}
                exact
              />
              <PrivateRoute path={`${path}/members`} render={Members} exact />
              <PrivateRoute
                path={`${path}/channels/:channelID`}
                render={Channel}
                exact
              />
              <PrivateRoute
                path={`${path}/channels/:channelID/settings`}
                render={EditChannel}
                exact
              />
              {!isMobile && (
                <PrivateRoute
                  render={() => (
                    <Suspense fallback={<Chat.Placeholder />}>
                      <CommunityChannelFallback />
                    </Suspense>
                  )}
                  path={'*'}
                />
              )}
            </Switch>
          </Suspense>
        </div>
      )}
    </>
  )
}

const CommunityProviders: FC = () => {
  return (
    <Permission.Provider>
      <CommunityView />
    </Permission.Provider>
  )
}

const Router: FC = () => {
  const matchTab = useRouteMatch<{ id: string; tab: string }>(
    '/communities/:id/:tab'
  )
  const isMobile = useMedia('(max-width: 740px)')
  return (
    <>
      {isMobile && !matchTab && <SideBar />}
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <Error
            resetErrorBoundary={resetErrorBoundary}
            error={error as any}
            className={styles.communityError}
          />
        )}
      >
        <Suspense fallback={<CommunityPlaceholder />}>
          <CommunityProviders />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
export default memo(Router)
