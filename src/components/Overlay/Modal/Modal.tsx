import { IconDefinition } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, ReactNode } from 'react'
import {
  StyledModal,
  StyledModalBody,
  StyledModalBottom,
  StyledModalHeader,
  StyledModalHeaderIcon,
  StyledModalSpacer
} from './Modal.style'

const Modal: FC<{
  onDismiss?: () => void
  icon?: IconDefinition | FC
  title?: string
  subtitle?: string
  children: ReactNode
  bottom?: ReactNode
  noWidth?: boolean
}> = ({
  onDismiss,
  icon: Icon,
  title,
  subtitle,
  children,
  bottom,
  noWidth
}) => {
  return (
    <StyledModal style={noWidth ? { width: 'auto' } : {}}>
      {title ? (
        <StyledModalHeader>
          {Icon &&
            (typeof Icon === 'function' ? (
              <Icon />
            ) : (
              <StyledModalHeaderIcon onClick={() => onDismiss && onDismiss()}>
                <FontAwesomeIcon icon={Icon} />
              </StyledModalHeaderIcon>
            ))}
          <div>
            {subtitle && <small>{subtitle}</small>}
            <h2>{title}</h2>
          </div>
        </StyledModalHeader>
      ) : (
        <StyledModalSpacer />
      )}
      <StyledModalBody bottom={!!bottom}>{children}</StyledModalBody>
      {bottom && <StyledModalBottom>{bottom}</StyledModalBottom>}
    </StyledModal>
  )
}

export default Modal
