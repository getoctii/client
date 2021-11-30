import styles from './Ringing.module.scss'
import { Modal } from '@/components/Overlay'
import {
  faPhone,
  faTimes,
  faUserFriends
} from '@fortawesome/pro-solid-svg-icons'
import { Button } from '@/components/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { useQueries } from 'react-query'
import { getUser } from '@/api/users'
import { Auth } from '@/state/auth'
import { UI } from '@/state/ui'
import { clientGateway } from '@/utils/constants'
import { Call } from '@/state/call'
import { useAudio } from 'react-use'
import { useConversation, useConversationMembers } from '@/hooks/conversations'
import { useNavigate } from 'react-location'
import Avatar from '@/components/Avatar/Avatar'

const Ringing: FC<{ id: string }> = ({ id }) => {
  const [audio] = useAudio({
    src: 'https://cdn.octii.chat/assets/ringtone.wav',
    autoPlay: true,
    loop: true
  })
  const auth = Auth.useContainer()
  const ui = UI.useContainer()
  const call = Call.useContainer()
  const navigate = useNavigate()
  const conversation = useConversation(id)
  const conversationMembers = useConversationMembers(id)
  const users = useQueries(
    (conversationMembers ?? [])
      .filter((member) => member.userID !== auth.id)
      .map((member) => {
        return {
          queryKey: ['user', member.userID, auth.token],
          queryFn: async () => getUser(member.userID, auth.token!)
        }
      })
  )

  return (
    <Modal noWidth>
      {audio}
      <div className={styles.container}>
        <Avatar
          username={
            users?.length === 1 ? users[0].data?.username : conversation?.id
          }
          size='call'
          avatar={users?.length !== 1 ? undefined : users[0].data?.avatar}
        />
        <div className={styles.details}>
          <h1>{users?.map(({ data: user }) => user?.username).join(', ')}</h1>
          <p>Incoming Call</p>
        </div>
        <div className={styles.buttons}>
          <Button
            type={'button'}
            className={styles.primary}
            onClick={async () => {
              const {
                data
              }: {
                data: { roomID: string; token: string; socket: string }
              } = await clientGateway.post(
                `/channels/${conversation?.voiceChannelID}/join`,
                {},
                {
                  headers: {
                    Authorization: auth.token
                  }
                }
              )
              call.setRoom({
                token: data.token,
                id: data.roomID,
                server: data.socket,
                conversationID: id,
                channelID: ''
              })
              call.play()
              ui.setModal(undefined)
              navigate({ to: `/app/conversations/${id}` })
            }}
          >
            <FontAwesomeIcon icon={faPhone} fixedWidth />
          </Button>
          <Button
            type={'button'}
            className={styles.danger}
            onClick={() => {
              ui.setModal(undefined)
            }}
          >
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default Ringing
