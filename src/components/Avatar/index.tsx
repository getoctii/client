import { FC } from 'react'
import { AvatarImage, AvatarPlaceholder } from './style'

const Avatar: FC<{
  username?: string
  avatar?: string
  size?: 'message' | 'conversation' | 'sidebar' | 'friend'
}> = ({ username, avatar, size, children }) => {
  return avatar ? (
    <AvatarImage
      size={size}
      style={{
        backgroundImage: `url(${avatar})`
      }}
    >
      {children}
    </AvatarImage>
  ) : (
    <AvatarPlaceholder size={size}>
      {(username || 'BRUH')?.split('')[0].toUpperCase()}
      {children}
    </AvatarPlaceholder>
  )
}

export default Avatar
