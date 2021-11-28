import { FC } from 'react'
import { Auth } from '@/state/auth'
import { useQuery } from 'react-query'
import styles from './Mention.module.scss'
import { getChannel } from '@/api/messages'
import { useHistory } from 'react-router-dom'
import { useUser } from '@/hooks/users'
import { useChannel } from '@/hooks/messages'
import { useNavigate } from 'react-location'

const User: FC<{
  userID: string
  selected?: boolean
  attributes?: any
}> = ({ userID, selected, attributes, children }) => {
  const { id } = Auth.useContainer()
  const user = useUser(userID)
  return (
    <span
      {...attributes}
      className={`${styles.mention} ${userID === id ? styles.isMe : ''} ${
        selected ? styles.selected : ''
      }`}
    >
      @{user?.username}
      {children}
    </span>
  )
}

const Channel: FC<{
  channelID: string
  selected?: boolean
  attributes?: any
}> = ({ channelID, selected, attributes, children }) => {
  const { token } = Auth.useContainer()
  const navigate = useNavigate()
  const channel = useChannel(channelID)
  return (
    <span
      {...attributes}
      className={`${styles.mention} ${styles.isMe} ${
        selected ? styles.selected : ''
      }`}
      onClick={() =>
        !attributes &&
        navigate({
          to: `/communities/${channel?.communityID}/channels/${channelID}`
        })
      }
    >
      #{channel?.name}
      {children}
    </span>
  )
}

const Mention = { User, Channel }

export default Mention
