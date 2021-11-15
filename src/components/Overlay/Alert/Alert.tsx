import { FC } from 'react'
import styles from './Alert.module.scss'
import { Button } from '@/components/Form'
import { UI } from '../../../state/ui'

export enum AlertType {
  TEXT = 'channel',
  CATEGORY = 'category',
  MESSAGE = 'message',
  DEVELOPER = 'developer'
}
const Alert: FC<{
  type: AlertType
  onConfirm: () => Promise<void> | void
}> = ({ type, onConfirm }) => {
  const ui = UI.useContainer()
  return (
    <div className={styles.confirmation}>
      <h3>
        {type === AlertType.DEVELOPER
          ? 'Are you sure you want to enable developer mode???????!?'
          : `Are you sure you want to delete this ${type}?`}
      </h3>
      <p>
        {type === AlertType.TEXT
          ? "One you do this, you cannot retrieve the channel and it's messages so beware."
          : type === AlertType.CATEGORY
          ? 'One you do this, the category is gone forever so beware.'
          : type === AlertType.MESSAGE
          ? 'One you do this, you cannot retrieve this message again so beware.'
          : type === AlertType.DEVELOPER
          ? 'YOU CANNOT DISABLE DEVELOPER MODE. PROCCED WITH CAUTION!!!'
          : 'One you do this, you cannot undo it.'}
      </p>
      <div>
        <Button
          type='button'
          className={styles.danger}
          onClick={async () => await onConfirm()}
        >
          {type === AlertType.DEVELOPER ? 'sell my soul' : 'Delete'}
        </Button>
        <div className={styles.separator} />
        <Button
          type='button'
          className={styles.cancel}
          onClick={() => ui.clearModal()}
        >
          {type === AlertType.DEVELOPER ? 'oh s***, nvm' : 'Cancel'}
        </Button>
      </div>
    </div>
  )
}

export default Alert
