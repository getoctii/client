import { FC, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import styles from './Channel.module.scss'
import { useQueries, useQuery } from 'react-query'
import {
  ChannelPermissions,
  ChannelTypes,
  clientGateway,
  InternalChannelTypes
} from '../utils/constants'
import { Auth } from '../authentication/state'
import { useDropArea, useMedia } from 'react-use'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowDown,
  faArrowUp,
  faChevronLeft,
  faHashtag,
  faMicrophone,
  faMicrophoneSlash,
  faPhone,
  faTimes,
  faUserPlus,
  faVolumeUp,
  faVolumeMute,
  faAt
} from '@fortawesome/free-solid-svg-icons'
import { useHistory, useParams } from 'react-router-dom'
import Box from './Box'
import Typing from '../state/typing'
import Button from '../components/Button'
import { ChannelResponse, getChannel } from './remote'
import Messages from './Messages'
import { fetchManyUsers, getKeychain, getUser } from '../user/remote'
import { Chat, useChannel } from './state'
import { Permission } from '../utils/permissions'
import AddParticipant from './AddParticipant'
import { VoiceCard } from '../community/voice/VoiceChannel'
import { Call } from '../state/call'
import { useCurrentUser, useUser } from '../user/state'
import { ConversationMember, ConversationType } from '../conversation/remote'
import { EncryptionPair } from '@innatical/inncryption'
import { useConversation } from '../conversation/state'
import { Keychain } from '../keychain/state'

const TypingIndicator: FC<{
  channelID: string
}> = ({ channelID }) => {
  const { id } = Auth.useContainer()
  const { typing } = Typing.useContainer()
  const users = useMemo(
    () =>
      typing[channelID]?.filter((userID) => userID[0] !== id).map((t) => t[1]),
    [typing, channelID, id]
  )
  if (users?.length > 0) {
    return (
      <p className={styles.typing}>
        {users?.length === 1
          ? `${users[0]} is typing...`
          : users?.length === 2
          ? `${users.join(' and ')} are typing...`
          : users?.length === 3
          ? `${users.slice(0, 2).join(', ')} and ${
              users[users.length - 1]
            } are typing...`
          : users?.length > 3
          ? 'A lot of people are typing...'
          : ''}
      </p>
    )
  } else return <div className={styles.typingEmpty} />
}

const PrivateName: FC<{ id?: string }> = ({ id }) => {
  const user = useUser(id)
  return (
    <div className={styles.title}>
      {user?.username}#
      {user?.discriminator === 0
        ? 'inn'
        : user?.discriminator.toString().padStart(4, '0')}
      <p className={styles.status}>{user?.status}</p>
    </div>
  )
}

const Header: FC<{
  members?: ConversationMember[]
  type: InternalChannelTypes
  channel?: ChannelResponse
}> = ({ members, type, channel }) => {
  const { token } = Auth.useContainer()

  const users = useQueries(
    (members ?? []).map((member) => {
      return {
        queryKey: ['user', member, token],
        queryFn: async () => getUser(member.userID, token!)
      }
    })
  )

  return (
    <div className={styles.title}>
      {type === InternalChannelTypes.PrivateChannel ? (
        <PrivateName id={members?.[0].userID} />
      ) : type === InternalChannelTypes.GroupChannel ? (
        users?.map((i) => i.data?.username).join(', ')
      ) : (
        channel?.name
      )}
      <p className={styles.status}>{channel?.description}</p>
    </div>
  )
}

const CommunityChannelView: FC = () => {
  const { id, channelID } = useParams<{ id: string; channelID: string }>()
  return (
    <ChannelView
      type={InternalChannelTypes.CommunityChannel}
      channelID={channelID}
      communityID={id}
    />
  )
}

const VideoCard: FC<{ track: MediaStreamTrack }> = ({ track }) => {
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const stream = new MediaStream()
    stream.addTrack(track)
    ref.current.srcObject = stream
    ref.current?.play()
  }, [ref, track])
  return <video ref={ref} className={styles.video} />
}

const CallView: FC<{ channel: ChannelResponse; conversationID: string }> = ({
  channel,
  conversationID
}) => {
  const {
    muted,
    setMuted,
    setDeafened,
    deafened,
    room,
    setRoom,
    play,
    remoteVideoTracks,
    speaking
  } = Call.useContainer()
  const { token } = Auth.useContainer()
  const current = useMemo(() => room?.channelID === channel.id, [room])
  const [currentVideoStream, setCurrentVideoStream] = useState(0)
  const trackLength = useMemo(
    () => remoteVideoTracks?.length ?? 0,
    [remoteVideoTracks]
  )

  console.log(speaking)

  return (
    <div className={styles.call}>
      <div className={styles.callContent}>
        <div
          className={`${styles.users} ${
            remoteVideoTracks?.length ?? 0 > 0 ? styles.vertical : ''
          }`}
        >
          {channel.voice_users?.map((user) => (
            <VoiceCard
              userID={user}
              speaking={
                (Array.from(speaking[user]?.values() ?? []).length ?? 0) > 0
              }
              small
            />
          ))}
        </div>
        {trackLength > 0 ? (
          <>
            <div className={styles.videoStreams}>
              {remoteVideoTracks ? (
                <VideoCard track={remoteVideoTracks[currentVideoStream]} />
              ) : (
                <></>
              )}
            </div>
            <div className={styles.videoButtons}>
              <Button
                type={'button'}
                onClick={() => {
                  if (currentVideoStream + 1 > trackLength - 1)
                    setCurrentVideoStream(0)
                  else setCurrentVideoStream(currentVideoStream + 1)
                }}
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </Button>
              <Button
                type={'button'}
                onClick={() => {
                  console.log(currentVideoStream - 1 < 0)
                  if (currentVideoStream - 1 < 0)
                    setCurrentVideoStream(trackLength - 1)
                  else setCurrentVideoStream(currentVideoStream - 1)
                }}
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </Button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className={styles.buttons}>
        <Button type='button' onClick={() => setMuted(!muted)}>
          <FontAwesomeIcon
            icon={muted ? faMicrophoneSlash : faMicrophone}
            fixedWidth
          />
        </Button>
        <Button
          className={current ? styles.disconnect : styles.connect}
          type='button'
          onClick={async () => {
            if (current) {
              setRoom(null)
            } else {
              const {
                data
              }: {
                data: { room_id: string; token: string; server: string }
              } = await clientGateway.post(
                `/channels/${channel.id}/join`,
                {},
                {
                  headers: {
                    Authorization: token
                  }
                }
              )
              setRoom({
                token: data.token,
                id: data.room_id,
                server: data.server,
                conversationID,
                channelID: channel.id
              })
              play()
            }
          }}
        >
          {current ? 'Disconnect' : 'Connect'}
        </Button>
        <Button type='button' onClick={() => setDeafened(!deafened)}>
          <FontAwesomeIcon
            icon={deafened ? faVolumeMute : faVolumeUp}
            fixedWidth
          />
        </Button>
      </div>
    </div>
  )
}

const ChannelView: FC<{
  type: InternalChannelTypes
  channelID: string
  members?: ConversationMember[]
  communityID?: string
  conversationID?: string
  voiceChannelID?: string
}> = ({
  type,
  channelID,
  members,
  communityID,
  conversationID,
  voiceChannelID
}) => {
  const { setUploadDetails } = Chat.useContainerSelector(
    ({ setUploadDetails }) => ({
      setUploadDetails
    })
  )
  const { keychain } = Keychain.useContainer()
  const { token, id } = Auth.useContainer()
  const { typing } = Typing.useContainer()
  const typingUsers = useMemo(
    () =>
      typing[channelID]?.filter((userID) => userID[0] !== id).map((t) => t[1]),
    [typing, channelID, id]
  )

  const [showAddParticipant, setShowAddParticipant] = useState(false)
  const isMobile = useMedia('(max-width: 740px)')
  const history = useHistory()

  const channel = useChannel(channelID)

  // const { hasChannelPermissions } = Permission.useContainer()
  const [bond] = useDropArea({
    onFiles: (files) => {
      setUploadDetails({
        status: 'pending',
        file: files[0]
      })
    }
  })

  const { setRoom, play, room } = Call.useContainer()

  const conversation = useConversation(conversationID)
  const { data: otherDMUser } = useQuery(
    ['users', members?.find((m) => m.userID !== id)?.userID, token],
    () => getUser(members!.find((m) => m.userID !== id)!.userID, token!),
    {
      enabled:
        conversation?.type === ConversationType.DM &&
        !!token &&
        !!members?.find((m) => m.userID !== id)
    }
  )

  const { data: sessionKey } = useQuery(
    ['sessionKey', otherDMUser?.keychain.publicKeychain.encryption],
    () =>
      keychain!.encryption.sessionKey(
        otherDMUser!.keychain.publicKeychain.encryption
      ),
    {
      enabled: !!otherDMUser
    }
  )

  return (
    <Suspense fallback={<ChannelPlaceholder />}>
      <div className={styles.chat} {...bond}>
        <div className={styles.header}>
          <div className={styles.heading}>
            {isMobile ? (
              <div
                className={styles.icon}
                style={
                  channel?.color
                    ? {
                        backgroundColor: channel?.color
                      }
                    : {
                        background: 'var(--neko-colors-primary)'
                      }
                }
                onClick={() => {
                  if (isMobile) {
                    if (type === InternalChannelTypes.CommunityChannel) {
                      history.push(`/communities/${channel?.communityID}`)
                    } else {
                      history.push('/')
                    }
                  }
                }}
              >
                <FontAwesomeIcon
                  className={styles.backButton}
                  icon={faChevronLeft}
                />
              </div>
            ) : (
              <div
                className={styles.icon}
                style={
                  channel?.color
                    ? {
                        backgroundColor: channel?.color
                      }
                    : {
                        background: 'var(--neko-colors-primary)'
                      }
                }
              >
                <FontAwesomeIcon icon={conversationID ? faAt : faHashtag} />
              </div>
            )}
            <Suspense fallback={<></>}>
              <Header type={type} members={members} channel={channel} />
            </Suspense>
            <div className={styles.buttonGroup}>
              {/* {voiceChannel && room?.channelID !== voiceChannel.id ? (
                <Button
                  type='button'
                  onClick={async () => {
                    if (!voiceChannel) return
                    const {
                      data
                    }: {
                      data: { room_id: string; token: string; server: string }
                    } = await clientGateway.post(
                      `/channels/${voiceChannel.id}/join`,
                      {},
                      {
                        headers: {
                          Authorization: token
                        }
                      }
                    )
                    setRoom({
                      token: data.token,
                      id: data.room_id,
                      server: data.server,
                      conversationID,
                      channelID: voiceChannelID
                    })
                    play()
                  }}
                >
                  <FontAwesomeIcon icon={faPhone} />
                </Button>
              ) : (
                <></>
              )} */}
              {type === InternalChannelTypes.PrivateChannel ||
              type === InternalChannelTypes.GroupChannel ? (
                <Button
                  type='button'
                  onClick={() => {
                    setShowAddParticipant(!showAddParticipant)
                  }}
                >
                  <FontAwesomeIcon
                    icon={showAddParticipant ? faTimes : faUserPlus}
                  />
                </Button>
              ) : (
                <></>
              )}
            </div>
            {showAddParticipant && (
              <AddParticipant
                isPrivate={type === InternalChannelTypes.PrivateChannel}
                groupID={
                  type === InternalChannelTypes.GroupChannel
                    ? conversationID
                    : undefined
                }
                participant={members?.[0].userID}
              />
            )}
          </div>
          {/* {voiceChannel && (voiceChannel.voice_users?.length ?? 0) > 0 ? (
            <CallView channel={voiceChannel} conversationID={conversationID!} />
          ) : (
            <></>
          )} */}
        </div>
        <Suspense fallback={<Messages.Placeholder />}>
          {channelID ? (
            <Messages.View channelID={channelID} sessionKey={sessionKey} />
          ) : (
            <Messages.Placeholder />
          )}
        </Suspense>
        <Box.View
          {...{
            sessionKey,
            hasPermission: true,
            members,
            channelID,
            typingIndicator: typingUsers?.length > 0,
            communityID
          }}
        />
        <TypingIndicator channelID={channelID} />
      </div>
    </Suspense>
  )
}

const ChannelPlaceholder: FC = () => {
  const username = useMemo(() => Math.floor(Math.random() * 6) + 3, [])
  const status = useMemo(() => Math.floor(Math.random() * 10) + 8, [])
  return (
    <div className={styles.placeholder}>
      <div className={styles.header}>
        <div className={styles.icon} />
        <div className={styles.title}>
          <div className={styles.name} style={{ width: `${username}rem` }} />
          <div className={styles.status} style={{ width: `${status}rem` }} />
        </div>
      </div>
      <Messages.Placeholder />
      <br />
      <Box.Placeholder />
    </div>
  )
}

const Channel = {
  View: ChannelView,
  Community: CommunityChannelView,
  Placeholder: ChannelPlaceholder
}

export default Channel
