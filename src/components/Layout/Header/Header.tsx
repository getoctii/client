import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, ReactNode } from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { useMedia } from 'react-use'
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons'
import {
  StyledHeaderIcon,
  StyledHeaderPlaceholderIcon,
  StyledHeaderPlaceholderTitle,
  StyledHeaderPlaceholderTitleCommunity,
  StyledHeaderPlaceholderTitleSubtitle,
  StyledHeaderPlaceholderWrapper,
  StyledHeaderWrapper
} from './Header.style'

const HeaderPlaceholder: FC = () => {
  return (
    <StyledHeaderPlaceholderWrapper>
      <StyledHeaderPlaceholderIcon />
      <StyledHeaderPlaceholderTitle>
        <StyledHeaderPlaceholderTitleCommunity />
        <StyledHeaderPlaceholderTitleSubtitle />
      </StyledHeaderPlaceholderTitle>
    </StyledHeaderPlaceholderWrapper>
  )
}

const Header: FC<{
  className?: string
  subheading: string
  heading: string
  onClick?: () => void
  onBack?: () => void
  color?: 'primary' | 'secondary'
  icon?: IconDefinition
  image?: string
  action?: ReactNode
}> = ({
  className,
  subheading,
  heading,
  onClick,
  onBack,
  color,
  icon,
  image,
  action
}) => {
  const isMobile = useMedia('(max-width: 740px)')
  return (
    <StyledHeaderWrapper className={className ? className : ''}>
      <StyledHeaderIcon
        primary={color === 'primary'}
        secondary={color === 'secondary'}
        clickable={!!onBack}
        onClick={() => (onBack && isMobile ? onBack() : onClick && onClick())}
        style={
          image && !icon && !isMobile
            ? {
                backgroundImage: `url('${image}')`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
              }
            : {}
        }
      >
        {(icon || isMobile) && (
          <FontAwesomeIcon
            icon={isMobile || !icon ? faChevronLeft : icon}
            size='2x'
          />
        )}
      </StyledHeaderIcon>
      <div>
        {subheading && <small>{subheading}</small>}
        <h2>{heading}</h2>
      </div>
      {action}
    </StyledHeaderWrapper>
  )
}

export const Placeholder = HeaderPlaceholder
export default Header
