import { faVolumeUp } from '@fortawesome/pro-solid-svg-icons'
import { FC } from 'react'
import { Auth } from '@/state/auth'
import { ChannelResponse } from '@/api/messages'
import { Header } from '@/components/Layout'
import { Button } from '@/components/Form'
import { useUser } from '@/hooks/users'
import styles from './VoiceChannel.module.scss'
import { Call } from '../../../state/call'
import { clientGateway } from '../../../utils/constants'
import Avatar from '@/components/Avatar/Avatar'

export const VoiceCard: FC<{
  userID: string
  speaking: boolean
  small?: boolean
}> = ({ userID, speaking, small }) => {
  const user = useUser(userID)
  if (!user) return <></>
  return (
    <div
      className={styles.card}
      style={{
        border: speaking ? '5px solid var(--neko-text-primary)' : undefined,
        width: small ? 100 : undefined,
        height: small ? 100 : undefined
      }}
    >
      <Avatar username={user.username} avatar={user.avatar} />
    </div>
  )
}

const VoiceChannel: FC<{ channel: ChannelResponse }> = ({ channel }) => {
  const { token } = Auth.useContainer()
  const { setRoom, play, room, speaking } = Call.useContainer()
  return (
    <div className={styles.channel}>
      <Header
        heading={channel.name}
        subheading=''
        color={'primary'}
        icon={faVolumeUp}
        action={
          room?.channelID !== channel.id ? (
            <Button
              type='button'
              className={styles.button}
              onClick={async () => {
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
                  channelID: channel.id
                })
                play()
              }}
            >
              Join
            </Button>
          ) : (
            <></>
          )
        }
      />
      <div className={styles.grid}>
        {channel.voiceUsers?.map((id) => (
          <VoiceCard
            userID={id}
            speaking={
              (Array.from(speaking[id]?.values() ?? []).length ?? 0) > 0
            }
            key={id}
          />
        ))}
      </div>
    </div>
  )
}

export default VoiceChannel
