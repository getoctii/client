import { motion } from 'framer-motion'
import { FC } from 'react'
import Avatar from '../components/Avatar'
import styles from './Icon.module.scss'
import { State } from './remote'

const Icon: FC<{
  className?: string
  username?: string
  avatar?: string
  state?: State
}> = ({ className, username, avatar, state }) => {
  return (
    <Avatar size='friend' username={username} avatar={avatar}>
      {state && (
        <div
          className={`${styles.badge} ${
            state === State.online
              ? styles.online
              : state === State.dnd
              ? styles.dnd
              : state === State.idle
              ? styles.idle
              : state === State.offline
              ? styles.offline
              : ''
          }`}
        />
      )}
    </Avatar>
  )
}

export default Icon
