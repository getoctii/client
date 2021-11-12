import Modal from '../components/Modal'
import Button from '../components/Button'
import { useUser } from './state'
import Icon from './Icon'
import { Auth } from '../authentication/state'
import styles from './PreviewUser.module.scss'
import { useHistory } from 'react-router-dom'
import { createConversation } from '../conversation/remote'
import { UI } from '../state/ui'
import { useCallback, useMemo } from 'react'
import queryClient from '../utils/queryClient'

const PreviewUser = ({ id }: { id: string }) => {
  const user = useUser(id)
  const auth = Auth.useContainer()
  const ui = UI.useContainer()
  const history = useHistory()

  const icon = useCallback(
    () => <Icon avatar={user?.avatar} state={user?.state}></Icon>,
    [user]
  )

  return (
    <Modal
      title={`${user?.username}#${
        user?.discriminator === 0
          ? 'inn'
          : String(user?.discriminator).padStart(4, '0')
      }`}
      icon={icon}
      subtitle={user?.status}
      onDismiss={() => {}}
    >
      <></>
    </Modal>
  )
}

export default PreviewUser
