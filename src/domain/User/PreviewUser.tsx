import { Modal } from '@/components/Overlay'
import { useUser } from '@/hooks/users'
import { Icon } from '@/domain/User'
import { Auth } from '@/state/auth'
import { useHistory } from 'react-router-dom'
import { UI } from '@/state/ui'
import { useCallback } from 'react'

const PreviewUser = ({ id }: { id: string }) => {
  const user = useUser(id)

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
