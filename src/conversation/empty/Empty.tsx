import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { Auth } from '../../authentication/state'
import Button from '../../components/Button'
import Icon from '../../user/Icon'
import NewConversation from '../NewConversation'
import { ConversationType, createConversation } from '../remote'
import styles from './Empty.module.scss'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-location'
import { useRelationships, useUser } from '../../user/state'

const FriendSuggestion: FC<{ id: string }> = ({ id }) => {
  const { token } = Auth.useContainer()
  const user = useUser(id)
  const navigate = useNavigate()
  return (
    <div
      className={styles.friendSuggestion}
      onClick={async () => {
        const result = await createConversation(token!, {
          recipient: id,
          type: ConversationType.DM
        })
        if (result.id) navigate({ to: `/conversations/${result.id}` })
      }}
    >
      <Icon avatar={user?.avatar} state={user?.state} />
      <div>
        <h4>{user?.username}</h4>
        <p>{user?.status}</p>
      </div>
      <FontAwesomeIcon className={styles.chrevron} icon={faPlusCircle} />
    </div>
  )
}

const Empty: FC = () => {
  const navigate = useNavigate()
  const relationships = useRelationships()

  return (
    <div className={styles.container}>
      {(relationships?.friends ?? []).length > 0 ? (
        <div className={styles.hasFriends}>
          <h1>Messages</h1>
          <p>Use the search bar to start new chats with friends!</p>
          <NewConversation />
          <br />

          <div className={styles.friends}>
            <h3>Suggestions</h3>
            {relationships?.friends.map((friend, index) => (
              <>
                {index !== 0 && <hr />}
                <FriendSuggestion key={friend} id={friend} />
              </>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.noFriends}>
          <h3>Looks like you don't have friends to chat with...</h3>
          <Button type='button' onClick={() => navigate({ to: '/app/hub' })}>
            Let's add some!
          </Button>
        </div>
      )}
    </div>
  )
}

export default Empty
