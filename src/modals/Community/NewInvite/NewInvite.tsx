import { FC, Suspense, useEffect, useState } from 'react'
import { Auth } from '@/state/auth'
import { Modal } from '@/components/Overlay'
import { Button, Input } from '@/components/Form'
import { clientGateway } from '@/utils/constants'
import styles from './NewInvite.module.scss'
import { useRouteMatch } from 'react-router-dom'
import { UI } from '@/state/ui'
import { useQuery } from 'react-query'
import { faTimesCircle } from '@fortawesome/pro-solid-svg-icons'

const InviteField: FC<{ onInvite: (invite: string) => void }> = ({
  onInvite
}) => {
  const auth = Auth.useContainer()
  const match = useRouteMatch<{ id: string }>('/communities/:id')
  const { data: invite } = useQuery(
    ['invite', match?.params.id, auth.id, auth.token],
    async () =>
      (
        await clientGateway.post<{
          id: string
          code: string
          created_at: string
          updated_at: string
        }>(
          `/communities/${match?.params.id}/invites`,
          {},
          { headers: { Authorization: auth.token } }
        )
      ).data,
    {
      enabled: !!match?.params.id
    }
  )

  useEffect(() => {
    if (invite?.code) onInvite(invite.code)
  }, [invite?.code, onInvite])
  return <Input defaultValue={`octii.com/${invite?.code ?? ''}`} disabled />
}

const NewInvite: FC = () => {
  const ui = UI.useContainer()
  const [invite, setInvite] = useState<string>()
  return (
    <div className={styles.newInvite}>
      <Modal
        title={'Invite Created'}
        icon={faTimesCircle}
        onDismiss={() => ui.clearModal()}
        bottom={
          <Button
            disabled={!invite}
            className={styles.copyInvite}
            type='submit'
            onClick={async () => {
              if (!invite) return
              await navigator.clipboard.writeText(
                `https://octii.chat/invite/${invite ?? ''}`
              )

              ui.clearModal()
            }}
          >
            Copy Invite
          </Button>
        }
      >
        <Suspense fallback={<Input disabled />}>
          <InviteField onInvite={(inv) => setInvite(inv)} />
        </Suspense>
      </Modal>
    </div>
  )
}

export default NewInvite
