import { IconDefinition } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, ReactNode } from 'react'
import styles from './Modal.module.scss'

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
    <div className={styles.modal} style={noWidth ? { width: 'auto' } : {}}>
      {title ? (
        <div className={styles.header}>
          {Icon &&
            (typeof Icon === 'function' ? (
              <Icon />
            ) : (
              <div
                className={styles.icon}
                onClick={() => onDismiss && onDismiss()}
              >
                <FontAwesomeIcon icon={Icon} />
              </div>
            ))}
          <div className={styles.title}>
            {subtitle && <small>{subtitle}</small>}
            <h2>{title}</h2>
          </div>
        </div>
      ) : (
        <div className={styles.spacer} />
      )}
      <div className={`${styles.body} ${bottom ? styles.bottomBody : ''}`}>
        {children}
      </div>
      {bottom && <div className={styles.bottom}>{bottom}</div>}
    </div>
  )
}

export default Modal
