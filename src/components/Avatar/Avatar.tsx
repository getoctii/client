import { FC } from 'react'
import { AvatarImage, AvatarPlaceholder } from './Avatar.style'
import ColorHash from 'color-hash'
const colorHash = new ColorHash()

const Avatar: FC<{
  username?: string
  avatar?: string
  size?: 'message' | 'conversation' | 'sidebar' | 'friend' | 'call'
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
    <AvatarPlaceholder
      size={size}
      style={{ backgroundColor: colorHash.hex(username ?? 'octii') }}
    >
      {(!children || size === 'friend') &&
        (username || 'BRUH')?.split('')[0].toUpperCase()}
      {children}
    </AvatarPlaceholder>
  )
}

export default Avatar
