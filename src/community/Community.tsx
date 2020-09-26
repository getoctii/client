import React, { Suspense, useState } from 'react'
import styles from './Community.module.scss'
import Chat from '../chat/Chat'
import { Redirect, Switch, useParams, useRouteMatch } from 'react-router-dom'
import { Auth } from '../authentication/state'
import { useQuery } from 'react-query'
import Loader from '../components/Loader'
import { Sidebar } from './sidebar/Sidebar'
import Skeleton from 'react-loading-skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/pro-solid-svg-icons'
import Button from '../components/Button'
import { NewChannel } from './NewChannel'
import { Settings } from './settings/Settings'
import { getCommunity } from './remote'
import { PrivateRoute } from '../authentication/PrivateRoute'

export interface CommunityResponse {
  id: string
  name: string
  icon: string
  large: boolean
  owner_id: string
  channels: {
    name: string
    id: string
  }[]
}

const EmptyCommunity = ({ community }: { community?: CommunityResponse }) => {
  const auth = Auth.useContainer()
  const [createMode, setCreateMode] = useState(false)
  return (
    <div className={styles.communityEmpty}>
      <small>{community?.name || <Skeleton />}</small>
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
          allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen={false}
        />
      ) : (
        <NewChannel
          community={community}
          onDismiss={() => setCreateMode(false)}
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
  return (
    <Chat
      title={
        `#${
          community.data.channels.find((channel) => channel.id === channelID)
            ?.name
        }` || '#unknown'
      }
      status={''}
      channelID={channelID}
    />
  )
}

export const Community = () => {
  const auth = Auth.useContainer()
  const { id } = useParams<{ id: string }>()
  const { path } = useRouteMatch()
  const community = useQuery(['community', id, auth.token], getCommunity)
  if (!community.data) return <></>
  if (community.data.channels.length <= 0)
    return <EmptyCommunity community={community.data} />

  return (
    <div className={styles.community} key={id}>
      <Sidebar />
      <Suspense fallback={<Loader />}>
        <Switch>
          <PrivateRoute path={`${path}/settings`} component={Settings} exact />
          <PrivateRoute
            path={`${path}/channels/:channelID`}
            component={Channel}
            exact
          />
          <Redirect
            path='*'
            to={`/communities/${id}/channels/${community.data.channels[0].id}`}
          />
        </Switch>
      </Suspense>
    </div>
  )
}
