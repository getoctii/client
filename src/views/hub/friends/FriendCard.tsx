import { FC } from 'react'
import styles from './FriendCard.module.scss'
import { Auth } from '../../authentication/state'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTimes, faUserCheck } from '@fortawesome/pro-solid-svg-icons'
import Icon from '../../../user/Icon'
import { useUser } from '../../../user/state'
import {
  deleteRelationship,
  putRelationship,
  RelationshipType
} from '../../../user/remote'

const FriendCardView: FC<{
  userID: string
  type: RelationshipType
}> = ({ userID, type }) => {
  const { token } = Auth.useContainer()
  const user = useUser(userID)
  // const { newRelationship, deleteRelationship } =
  //   Relationships.useContainerSelector(
  //     ({ newRelationship, deleteRelationship }) => ({
  //       newRelationship,
  //       deleteRelationship
  //     })
  //   )
  return (
    <div className={styles.card}>
      <Icon
        className={styles.icon}
        username={user?.username}
        avatar={user?.avatar}
        state={user?.state}
      />
      <h4>
        {user?.username}#
        {user?.discriminator === 0
          ? 'inn'
          : user?.discriminator.toString().padStart(4, '0')}
      </h4>
      <div className={styles.details}>
        {type === RelationshipType.INCOMING ? (
          <>
            <FontAwesomeIcon
              className={styles.primary}
              icon={faUserCheck}
              fixedWidth
              onClick={async () => {
                await putRelationship(userID, RelationshipType.OUTGOING, token!)
              }}
            />
            <FontAwesomeIcon
              className={styles.danger}
              icon={faUserTimes}
              fixedWidth
              onClick={async () => {
                await deleteRelationship(userID, token!)
              }}
            />
          </>
        ) : type === RelationshipType.FRIEND ||
          type === RelationshipType.OUTGOING ? (
          <FontAwesomeIcon
            className={styles.danger}
            icon={faUserTimes}
            fixedWidth
            onClick={async () => {
              await deleteRelationship(userID, token!)
            }}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

const FriendCardPlaceholder: FC = () => {
  return (
    <div className={styles.friendPlaceholder}>
      <div className={styles.icon} />
      <div className={styles.tag} />
    </div>
  )
}

const FriendCard = { View: FriendCardView, Placeholder: FriendCardPlaceholder }

export default FriendCard
