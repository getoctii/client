import React, { Suspense, useState } from 'react'
import styles from './Community.module.scss'
import Chat from '../chat/Channel'
import { Redirect, Switch, useParams, useRouteMatch } from 'react-router-dom'
import { Auth } from '../authentication/state'
import { useQuery } from 'react-query'
import Channels from './sidebar/Sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/pro-solid-svg-icons'
import Button from '../components/Button'
import { NewChannel } from './NewChannel'
import { Settings } from './settings/Settings'
import { CommunityResponse, getCommunity } from './remote'
import { PrivateRoute } from '../authentication/PrivateRoute'
import { useMedia } from 'react-use'
import Sidebar from '../sidebar/Sidebar'
import { Members } from './Members'
import { ChannelTypes } from '../utils/constants'

const EmptyCommunity = ({
  community,
  dismiss
}: {
  community: CommunityResponse
  dismiss: () => void
}) => {
  const auth = Auth.useContainer()
  const [createMode, setCreateMode] = useState(false)

  return (
    <div className={styles.communityEmpty}>
      <small>{community?.name}</small>
      {!createMode ? (
        <>
          <h1 style={{ marginTop: 0 }}>
            <span role='img' aria-label='hands'>
              🙌{' '}
            </span>
            Hi, this community is empty.
          </h1>
          {community?.owner_id === auth.id ? (
            <Button
              type='button'
              className={styles.createButton}
              style={{ maxWidth: '300px', marginTop: 0 }}
              onClick={() => {
                setCreateMode(true)
              }}
            >
              Create a Channel <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          ) : (
            <></>
          )}
          <br />
          <h3>Here's a meme for now.</h3>
        </>
      ) : (
        <></>
      )}
      {!createMode ? (
        <iframe
          className={styles.video}
          title='sgn'
          width='966'
          height='543'
          src='https://www.youtube.com/embed/dQw4w9WgXcQ'
          frameBorder={0}
          allow='autoplay; encrypted-media'
          allowFullScreen={false}
        />
      ) : (
        <NewChannel
          community={community}
          onDismiss={() => {
            setCreateMode(false)
            dismiss()
          }}
        />
      )}
    </div>
  )
}

const Channel = () => {
  const { id, channelID } = useParams<{ id: string; channelID: string }>()
  const auth = Auth.useContainer()
  const community = useQuery(['community', id, auth.token], getCommunity)
  if (!community?.data) return <></>
  const channel = community.data.channels.find(
    (channel) => channel === channelID
  )
  if (!channel) return <>1</>
  return (
    <Chat.View
      type={ChannelTypes.CommunityChannel}
      channelID={channel}
      key={channel}
      communityID={community.data.id}
    />
  )
}

const Placeholder = () => {
  const isMobile = useMedia('(max-width: 740px)')
  return (
    <>
      <Channels.Placeholder />
      {!isMobile && <Chat.Placeholder />}
    </>
  )
}

const Community = () => {
  const auth = Auth.useContainer()
  const [count, forceRender] = useState<number>(0)
  const { id } = useParams<{ id: string }>()
  const { path } = useRouteMatch()
  const match = useRouteMatch<{ id: string }>('/communities/:id/:page')
  const isMobile = useMedia('(max-width: 740px)')
  const community = useQuery(['community', id, auth.token], getCommunity)

  if (!community.data) return <></>
  return community.data.channels.length <= 0 ? (
    <EmptyCommunity
      community={community.data}
      dismiss={() => forceRender(count + 1)}
    />
  ) : (
    <div className={styles.community} key={id}>
      {isMobile && !match ? (
        <Channels.View />
      ) : !isMobile ? (
        <Channels.View />
      ) : (
        <></>
      )}

      <Suspense fallback={<Chat.Placeholder />}>
        <Switch>
          <PrivateRoute path={`${path}/settings`} component={Settings} exact />
          <PrivateRoute path={`${path}/members`} component={Members} exact />

          <PrivateRoute
            path={`${path}/channels/:channelID`}
            component={Channel}
            exact
          />
          {!isMobile && (
            <Redirect
              path='*'
              to={`/communities/${id}/channels/${community.data.channels[0]}`}
            />
          )}
        </Switch>
      </Suspense>
    </div>
  )
}

const Router = () => {
  const isMobile = useMedia('(max-width: 740px)')
  const match = useRouteMatch<{ id: string; tab: string }>(
    '/communities/:id/:tab'
  )
  return (
    <>
      {isMobile && !match && <Sidebar />}
      <Suspense fallback={<Placeholder />}>
        <Community />
      </Suspense>
    </>
  )
}

export default Router
