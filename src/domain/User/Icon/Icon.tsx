import { motion } from 'framer-motion'
import { FC } from 'react'
import Avatar from '@/components/Avatar/Avatar'
import styles from './Icon.module.scss'
import { State } from '@/api/users'

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
            state === State.ONLINE
              ? styles.online
              : state === State.DND
              ? styles.dnd
              : state === State.IDLE
              ? styles.idle
              : state === State.OFFLINE
              ? styles.offline
              : ''
          }`}
        />
      )}
    </Avatar>
  )
}

export default Icon
