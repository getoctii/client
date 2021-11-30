import { FC } from 'react'
import Avatar from '@/components/Avatar/Avatar'
import { State } from '@/api/users'
import { StyledIconBadge } from './Icon.style'

const Icon: FC<{
  className?: string
  username?: string
  avatar?: string
  state?: State
}> = ({ className, username, avatar, state }) => {
  return (
    <Avatar size='friend' username={username} avatar={avatar}>
      {state && <StyledIconBadge className={className} state={state} />}
    </Avatar>
  )
}

export default Icon
