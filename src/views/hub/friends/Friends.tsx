import { FC, Suspense, useState } from 'react'
import styles from './Friends.module.scss'
import FriendCard from './FriendCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserClock } from '@fortawesome/pro-solid-svg-icons'
import EmptyFriends from './EmptyFriends'
import { faPlus } from '@fortawesome/pro-solid-svg-icons'
import { UI } from '@/state/ui'
import { ModalTypes } from '@/utils/constants'
import { useRelationships } from '@/hooks/users'
import { RelationshipType } from '@/api/users'

const Friends: FC = () => {
  const ui = UI.useContainer()
  const relationships = useRelationships()
  const [showIncoming, setShowIncoming] = useState(false)
  const [showOutgoing, setShowOutgoing] = useState(false)

  return (
    <>
      <div className={styles.friends}>
        <h4>
          Friends{' '}
          <span>
            <FontAwesomeIcon
              className={styles.add}
              icon={faPlus}
              onClick={() => ui.setModal({ name: ModalTypes.ADD_FRIEND })}
            />
          </span>
        </h4>
        {(relationships?.outgoing?.length ?? 0) > 0 && (
          <div className={styles.incoming}>
            <div
              className={styles.dropdown}
              onClick={() => setShowOutgoing(!showOutgoing)}
            >
              <FontAwesomeIcon icon={faUserClock} /> Outgoing{' '}
              <span>{relationships?.outgoing?.length}</span>
            </div>
            <div className={styles.cards}>
              {showOutgoing &&
                relationships?.outgoing?.map((friend) => (
                  <Suspense key={friend} fallback={<FriendCard.Placeholder />}>
                    <FriendCard.View
                      userID={friend}
                      type={RelationshipType.OUTGOING}
                    />
                  </Suspense>
                ))}
            </div>
            <br />
          </div>
        )}
        {(relationships?.incoming?.length ?? 0) > 0 && (
          <div className={styles.incoming}>
            <div
              className={styles.dropdown}
              onClick={() => setShowIncoming(!showIncoming)}
            >
              <FontAwesomeIcon icon={faUserClock} /> Incoming{' '}
              <span>{relationships?.incoming?.length}</span>
            </div>
            {showIncoming && (
              <div className={styles.cards}>
                {relationships?.incoming?.map((friend) => (
                  <Suspense key={friend} fallback={<FriendCard.Placeholder />}>
                    <FriendCard.View
                      userID={friend}
                      type={RelationshipType.INCOMING}
                    />
                  </Suspense>
                ))}
              </div>
            )}
            <br />
          </div>
        )}
        <div className={styles.list}>
          {(relationships?.friends?.length ?? 0) > 0 ? (
            relationships?.friends?.map((friend, index) => (
              <>
                {index !== 0 && <hr />}
                <Suspense key={friend} fallback={<FriendCard.Placeholder />}>
                  <FriendCard.View
                    userID={friend}
                    type={RelationshipType.FRIEND}
                  />
                </Suspense>
              </>
            ))
          ) : (
            <EmptyFriends />
          )}
        </div>
      </div>
    </>
  )
}

export default Friends
