import { FC, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useQueries, useQuery } from 'react-query'
import { clientGateway, InternalChannelTypes } from '@/utils/constants'
import { Auth } from '@/state/auth'
import { useDropArea } from 'react-use'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowDown,
  faArrowUp,
  faHashtag,
  faMicrophone,
  faMicrophoneSlash,
  faPhone,
  faTimes,
  faUserPlus,
  faVolumeUp,
  faVolumeMute,
  faAt,
  faUserGroup
} from '@fortawesome/pro-solid-svg-icons'
import { Box } from '@/domain/Chat'
import Typing from '@/state/typing'
import { Button } from '@/components/Form'
import Messages from '../Messages'
import { getUser } from '@/api/users'
import { ChannelResponse } from '@/api/messages'
import { useChannel } from '@/hooks/messages'
import { Chat } from '@/state/chat'
import { AddMember } from '@/domain/Conversation'
import { VoiceCard } from '@/views/community/voice/VoiceChannel'
import { Call } from '@/state/call'
import { useUser } from '@/hooks/users'
import { ConversationMember, ConversationType } from '@/api/conversations'
import { useConversation } from '@/hooks/conversations'
import { Keychain } from '@/state/keychain'
import { useMatch } from 'react-location'
import {
  StyledChannel,
  StyledChannelCall,
  StyledChannelCallButtons,
  StyledChannelCallContent,
  StyledChannelCallUsers,
  StyledChannelCallVideo,
  StyledChannelCallVideoButtons,
  StyledChannelCallVideoStreams,
  StyledChannelHeader,
  StyledChannelHeaderButtonGroup,
  StyledChannelHeaderIcon,
  StyledChannelHeaderStatus,
  StyledChannelHeaderTitle,
  StyledChannelHeading,
  StyledChannelPlaceholder,
  StyledChannelPlaceholderHeader,
  StyledChannelPlaceholderHeaderIcon,
  StyledChannelPlaceholderHeaderTitle,
  StyledChannelPlaceholderHeaderTitleName,
  StyledChannelPlaceholderHeaderTitleStatus,
  StyledChannelTyping,
  StyledChannelTypingEmpty
} from './Channel.style'

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
      <StyledChannelTyping>
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
      </StyledChannelTyping>
    )
  } else return <StyledChannelTypingEmpty />
}

const PrivateName: FC<{ id?: string }> = ({ id }) => {
  const user = useUser(id)
  return (
    <StyledChannelHeaderTitle>
      {user?.username}#
      {user?.discriminator === 0
        ? 'inn'
        : user?.discriminator.toString().padStart(4, '0')}
      <StyledChannelHeaderStatus>{user?.status}</StyledChannelHeaderStatus>
    </StyledChannelHeaderTitle>
  )
}

const Header: FC<{
  members?: ConversationMember[]
  type?: ConversationType
  channel?: ChannelResponse
  name?: string
}> = ({ members, type, channel, name }) => {
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
    <StyledChannelHeaderTitle>
      {type === ConversationType.DM ? (
        (members ?? []).length > 0 ? (
          <PrivateName id={members?.[0].userID} />
        ) : (
          'Empty Group'
        )
      ) : type === ConversationType.GROUP ? (
        name ?? users?.map((i) => i.data?.username).join(', ')
      ) : (
        channel?.name
      )}
      <StyledChannelHeaderStatus>
        {channel?.description}
      </StyledChannelHeaderStatus>
    </StyledChannelHeaderTitle>
  )
}

const CommunityChannelView: FC = () => {
  const {
    params: { id, channelID }
  } = useMatch()
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
  return <StyledChannelCallVideo ref={ref} />
}

const VoiceChannel: FC<{
  id: string
  conversationID: string
}> = ({ id, conversationID }) => {
  const voiceChannel = useChannel(id)
  return (
    <>
      {voiceChannel && (voiceChannel.voiceUsers?.length ?? 0) > 0 ? (
        <CallView channel={voiceChannel} conversationID={conversationID!} />
      ) : (
        <></>
      )}
    </>
  )
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
    <StyledChannelCall>
      <StyledChannelCallContent>
        <StyledChannelCallUsers vertical={(remoteVideoTracks?.length ?? 0) > 0}>
          {channel.voiceUsers?.map((user) => (
            <VoiceCard
              userID={user}
              speaking={
                (Array.from(speaking[user]?.values() ?? []).length ?? 0) > 0
              }
              small
            />
          ))}
        </StyledChannelCallUsers>
        {trackLength > 0 ? (
          <>
            <StyledChannelCallVideoStreams>
              {remoteVideoTracks ? (
                <VideoCard track={remoteVideoTracks[currentVideoStream]} />
              ) : (
                <></>
              )}
            </StyledChannelCallVideoStreams>
            <StyledChannelCallVideoButtons>
              <Button
                primary
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
                primary
                onClick={() => {
                  console.log(currentVideoStream - 1 < 0)
                  if (currentVideoStream - 1 < 0)
                    setCurrentVideoStream(trackLength - 1)
                  else setCurrentVideoStream(currentVideoStream - 1)
                }}
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </Button>
            </StyledChannelCallVideoButtons>
          </>
        ) : (
          <></>
        )}
      </StyledChannelCallContent>
      <StyledChannelCallButtons>
        <Button type='button' onClick={() => setMuted(!muted)}>
          <FontAwesomeIcon icon={muted ? faMicrophoneSlash : faMicrophone} />
        </Button>

        <Button type='button' onClick={() => setDeafened(!deafened)}>
          <FontAwesomeIcon icon={deafened ? faVolumeMute : faVolumeUp} />
        </Button>
        <Button
          danger={current}
          primary={!current}
          type='button'
          onClick={async () => {
            if (current) {
              setRoom(null)
            } else {
              const {
                data
              }: {
                data: { roomID: string; token: string; socket: string }
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
                id: data.roomID,
                server: data.socket,
                conversationID,
                channelID: channel.id
              })
              play()
            }
          }}
        >
          {current ? 'Disconnect' : 'Connect'}
        </Button>
      </StyledChannelCallButtons>
    </StyledChannelCall>
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
      enabled: !!otherDMUser && conversation?.type === ConversationType.DM
    }
  )

  return (
    <Suspense fallback={<ChannelPlaceholder />}>
      <StyledChannel {...bond}>
        <StyledChannelHeader>
          <StyledChannelHeading>
            <StyledChannelHeaderIcon>
              <FontAwesomeIcon
                icon={
                  conversation?.type === ConversationType.DM
                    ? faAt
                    : conversation?.type === ConversationType.GROUP
                    ? faUserGroup
                    : faHashtag
                }
              />
            </StyledChannelHeaderIcon>

            <Suspense fallback={<></>}>
              <Header
                type={conversation?.type}
                members={members}
                channel={channel}
                name={conversation?.name}
              />
            </Suspense>
            <StyledChannelHeaderButtonGroup>
              {voiceChannelID && room?.channelID !== voiceChannelID && (
                <div
                  onClick={async () => {
                    if (!voiceChannelID) return
                    const {
                      data
                    }: {
                      data: { roomID: string; token: string; socket: string }
                    } = await clientGateway.post(
                      `/channels/${voiceChannelID}/join`,
                      {},
                      {
                        headers: {
                          Authorization: token
                        }
                      }
                    )
                    setRoom({
                      token: data.token,
                      id: data.roomID,
                      server: data.socket,
                      conversationID,
                      channelID: voiceChannelID
                    })
                    play()
                  }}
                >
                  <FontAwesomeIcon icon={faPhone} />
                </div>
              )}
              {conversation?.type === ConversationType.DM && (
                <div
                  onClick={() => {
                    setShowAddParticipant(!showAddParticipant)
                  }}
                >
                  <FontAwesomeIcon
                    icon={showAddParticipant ? faTimes : faUserPlus}
                  />
                </div>
              )}
            </StyledChannelHeaderButtonGroup>
            {showAddParticipant && (
              <AddMember
                groupID={
                  type === InternalChannelTypes.GroupChannel
                    ? conversationID
                    : undefined
                }
                participant={members?.[0].userID}
              />
            )}
          </StyledChannelHeading>
          {voiceChannelID && (
            <VoiceChannel
              id={voiceChannelID}
              conversationID={conversationID!}
            />
          )}
        </StyledChannelHeader>
        <Suspense fallback={<Messages.Placeholder />}>
          {channelID ? (
            <Messages.View
              channelID={channelID}
              conversationID={conversationID}
            />
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
      </StyledChannel>
    </Suspense>
  )
}

const ChannelPlaceholder: FC = () => {
  const username = useMemo(() => Math.floor(Math.random() * 6) + 3, [])
  const status = useMemo(() => Math.floor(Math.random() * 10) + 8, [])
  return (
    <StyledChannelPlaceholder>
      <StyledChannelPlaceholderHeader>
        <StyledChannelPlaceholderHeaderIcon />
        <StyledChannelPlaceholderHeaderTitle>
          <StyledChannelPlaceholderHeaderTitleName
            style={{ width: `${username}rem` }}
          />
          <StyledChannelPlaceholderHeaderTitleStatus
            style={{ width: `${status}rem` }}
          />
        </StyledChannelPlaceholderHeaderTitle>
      </StyledChannelPlaceholderHeader>
      <Messages.Placeholder />
      <br />
      <Box.Placeholder />
    </StyledChannelPlaceholder>
  )
}

const Channel = {
  View: ChannelView,
  Community: CommunityChannelView,
  Placeholder: ChannelPlaceholder
}

export default Channel
