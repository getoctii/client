import {
  faDesktop,
  faMicrophone,
  faMicrophoneSlash,
  faPhoneSlash,
  faTimes,
  faVolumeUp,
  faVolumeMute
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, useMemo } from 'react'
import { Call } from '../../state/call'
import styles from './Current.module.scss'
import { Auth } from '@/state/auth'
import { useQueries } from 'react-query'
import { useHistory } from 'react-router-dom'
import { getUser } from '@/api/users'
import { useChannel } from '@/hooks/messages'
import { useConversationMembers } from '@/hooks/conversations'

const Current: FC = () => {
  const { token, id } = Auth.useContainer()
  const {
    state,
    setMuted,
    muted,
    setDeafened,
    deafened,
    setRoom,
    room,
    shareScreen,
    sharingScreen,
    setScreenStream
  } = Call.useContainerSelector(
    ({
      state,
      setMuted,
      muted,
      setDeafened,
      deafened,
      setRoom,
      room,
      shareScreen,
      sharingScreen,
      setScreenStream
    }) => ({
      state,
      setMuted,
      muted,
      setDeafened,
      deafened,
      setRoom,
      room,
      shareScreen,
      sharingScreen,
      setScreenStream
    })
  )

  const history = useHistory()
  const channel = useChannel(room?.channelID)

  const conversationMembers = useConversationMembers(room?.conversationID)
  const users = useQueries(
    (conversationMembers ?? []).map((member) => {
      return {
        queryKey: ['user', member.userID, token],
        queryFn: async () => getUser(member.userID, token!)
      }
    })
  )

  return (
    <div className={styles.current}>
      <h3
        className={styles.pointer}
        onClick={() => {
          if (room?.conversationID) {
            history.push(`/conversations/${room.conversationID}`)
          } else {
            history.push(
              `/communities/${channel?.communityID}/channels/${channel?.id}`
            )
          }
        }}
      >
        {users && users.length > 0
          ? 'Call w/' +
            users?.map(({ data: user }) => user?.username).join(', ')
          : '#' + channel?.name}
      </h3>
      <p>
        {state === 'new' || !state
          ? 'Connecting to server...'
          : state === 'failed' || state === 'disconnected'
          ? 'Connection failure'
          : state === 'connected' ||
            state === 'completed' ||
            state === 'checking'
          ? 'Connected'
          : ''}
      </p>
      <nav>
        <button onClick={() => setMuted(!muted)}>
          {muted ? (
            <FontAwesomeIcon icon={faMicrophoneSlash} fixedWidth />
          ) : (
            <FontAwesomeIcon icon={faMicrophone} fixedWidth />
          )}
        </button>
        <button onClick={() => setDeafened(!deafened)}>
          {deafened ? (
            <FontAwesomeIcon icon={faVolumeMute} fixedWidth />
          ) : (
            <FontAwesomeIcon icon={faVolumeUp} fixedWidth />
          )}
        </button>
        {room?.conversationID ? (
          <button
            onClick={() =>
              sharingScreen ? setScreenStream(null) : shareScreen()
            }
          >
            {sharingScreen ? (
              <FontAwesomeIcon icon={faTimes} fixedWidth />
            ) : (
              <FontAwesomeIcon icon={faDesktop} fixedWidth />
            )}
          </button>
        ) : (
          <></>
        )}
        <button onClick={() => setRoom(null)}>
          <FontAwesomeIcon icon={faPhoneSlash} fixedWidth />
        </button>
      </nav>
    </div>
  )
}

export default Current
