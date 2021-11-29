import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, useCallback, useEffect, useState, Fragment } from 'react'
import { ContextMenuItems, UI } from '../../../state/ui'
import styles from './ContextMenu.module.scss'

export const ContextGlobal: FC = () => {
  const { contextMenu, setContextMenu } = UI.useContainer()
  const handleClick = useCallback(() => {
    if (contextMenu) {
      setContextMenu(null)
    }
  }, [contextMenu, setContextMenu])
  const handleResize = useCallback(() => {
    if (contextMenu) {
      setContextMenu(null)
    }
  }, [contextMenu, setContextMenu])
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousedown', handleClick)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousedown', handleClick)
    }
  }, [handleClick, handleResize])

  return <></>
}

export const ContextMenu: FC<{
  position: {
    top?: number
    left: number
    bottom?: number
  }
  items: ContextMenuItems
}> = ({ position, items }) => {
  const { setContextMenu } = UI.useContainer()

  return (
    <div
      key={Math.random() * 100}
      className={styles.menu}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        bottom: `${position.bottom}px`
      }}
    >
      {items.map(({ text, icon, danger, onClick }, index) => (
        <Fragment key={index}>
          {danger && <hr />}
          <div
            className={danger ? styles.danger : ''}
            onMouseDown={(event) => {
              event.persist()
              event.stopPropagation()
              if (event.buttons === 1) {
                onClick(event)
                setContextMenu(null)
              }
            }}
          >
            <span>{text}</span>
            <FontAwesomeIcon icon={icon} fixedWidth />
          </div>
        </Fragment>
      ))}
    </div>
  )
}

export const ContextWrapper: FC<{
  title: string
  message?: string
  children: React.ReactNode
  items: ContextMenuItems
  disabled?: boolean
}> = ({ title, message, children, items, disabled }) => {
  const { setContextMenu } = UI.useContainer()
  const [touchTimeout, setTouchTimeout] = useState<any>()
  return (
    <div
      className={styles.wrapper}
      onMouseDown={(event) => {
        event.persist()
        event.stopPropagation()
        if (event.buttons === 1) {
          setContextMenu(null)
        }
      }}
    >
      <div
        style={{ zIndex: 2 }}
        onMouseDown={(event) => {
          if (disabled) return
          if (event.buttons === 2) {
            const itemsSize = items.length * 34 + 15
            if (window.innerHeight - (event.pageY + itemsSize) < 20) {
              setContextMenu({
                position: {
                  bottom: 10,
                  left: event.pageX,
                  top: undefined
                },
                items
              })
            } else {
              setContextMenu({
                position: {
                  top: event.pageY,
                  left: event.pageX,
                  bottom: undefined
                },
                items
              })
            }
          }
        }}
      >
        {children}
      </div>
    </div>
  )
}

const Context = {
  Menu: ContextMenu,
  Wrapper: ContextWrapper,
  Global: ContextGlobal
}

export default Context
