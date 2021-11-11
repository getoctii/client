import styles from './Ringing.module.scss'
import Modal from '../components/Modal'
import {
  faPhone,
  faTimes,
  faUserFriends
} from '@fortawesome/free-solid-svg-icons'
import Button from '../components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, useMemo } from 'react'
import { useQueries, useQuery } from 'react-query'
import { fetchManyUsers, getUser } from '../user/remote'
import { Auth } from '../authentication/state'
import { UI } from '../state/ui'
import { clientGateway } from '../utils/constants'
import { Call } from '../state/call'
import { useHistory } from 'react-router-dom'
import { useAudio } from 'react-use'
import { useConversationMembers } from '../conversation/state'

const Ringing: FC<{ id: string }> = ({ id }) => {
  const [audio] = useAudio({
    src: 'https://cdn.octii.chat/assets/ringtone.wav',
    autoPlay: true,
    loop: true
  })
  const auth = Auth.useContainer()
  const ui = UI.useContainer()
  const call = Call.useContainer()
  const history = useHistory()

  const conversationMembers = useConversationMembers(id)
  const users = useQueries(
    (conversationMembers ?? []).map((member) => {
      return {
        queryKey: ['user', member.userID, auth.token],
        queryFn: async () => getUser(member.userID, auth.token!)
      }
    })
  )

  return (
    <Modal onDismiss={() => {}} icon={faPhone} title={'Incoming Call'}>
      {audio}
      <div className={styles.container}>
        {users?.length === 1 ? (
          <img src={users[0].data?.avatar} alt={users[0].data?.username} />
        ) : (
          <div className={styles.gc}>
            <FontAwesomeIcon icon={faUserFriends} size={'2x'} />
          </div>
        )}
        <h1>{users?.map(({ data: user }) => user?.username).join(', ')}</h1>
        <div className={styles.buttons}>
          <Button
            type={'button'}
            className={styles.primary}
            onClick={async () => {
              const {
                data
              }: {
                data: { room_id: string; token: string; server: string }
              } = await clientGateway.post(
                `/channels//join`,
                {},
                {
                  headers: {
                    Authorization: auth.token
                  }
                }
              )
              call.setRoom({
                token: data.token,
                id: data.room_id,
                server: data.server,
                conversationID: id,
                channelID: ''
              })
              call.play()
              ui.setModal(undefined)
              history.push(`/conversations/${id}`)
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
