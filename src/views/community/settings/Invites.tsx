import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'
import dayjsUTC from 'dayjs/plugin/utc'
import dayjsCalendar from 'dayjs/plugin/calendar'
import { memo, Suspense, FC } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useRouteMatch } from 'react-router-dom'
import { Auth } from '@/state/auth'
import { Button } from '@/components/Form'
import { getUser } from '@/api/users'
import styles from './Invites.module.scss'
import { getInvites, InviteResponse } from '@/api/invites'
import {
  faCopy,
  faPlusCircle,
  faTrashAlt,
  faUsers
} from '@fortawesome/pro-solid-svg-icons'
import { clientGateway, ModalTypes } from '../../../utils/constants'
import { List } from '@/components/Layout'
import { UI } from '../../../state/ui'
import { useMedia } from 'react-use'
import queryClient from '../../../utils/queryClient'
import { useUser } from '@/hooks/users'

dayjs.extend(dayjsUTC)
dayjs.extend(dayjsCalendar)

const InviteCard: FC<InviteResponse> = memo((invite) => {
  const match = useRouteMatch<{ id: string }>('/communities/:id/settings')
  const { token } = Auth.useContainer()
  const user = useUser(invite.author_id)
  const isMobile = useMedia('(max-width: 873px)')
  const deleteInvite = useMutation(
    async () =>
      (
        await clientGateway.delete(`/invites/${invite.id}`, {
          headers: { Authorization: token }
        })
      ).data,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          'invites',
          match?.params.id,
          token
        ])
      }
    }
  )
  return (
    <List.Card
      icon={<div className={styles.icon}>{invite.uses}</div>}
      title={
        <>
          {user?.username}#
          {user?.discriminator === 0
            ? 'inn'
            : user?.discriminator.toString().padStart(4, '0')}
        </>
      }
      subtitle={invite.code}
      actions={
        <>
          <Button
            className={styles.copyButton}
            type='button'
            onClick={async () => {
              await navigator.clipboard.writeText(
                `https://octii.com/${invite.code}`
              )
            }}
          >
            <FontAwesomeIcon icon={faCopy} />
            {!isMobile && 'Copy'}
          </Button>
          {!isMobile && (
            <Button
              type='button'
              className={styles.deleteButton}
              onClick={async () => await deleteInvite.mutate()}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          )}
        </>
      }
    />
  )
})

const InvitesView: FC = () => {
  const ui = UI.useContainer()
  const match = useRouteMatch<{ id: string }>('/communities/:id/settings')
  const { token } = Auth.useContainer()
  const invites = useQuery(['invites', match?.params.id, token], getInvites)
  return (
    <div className={styles.invites}>
      <List.View>
        {invites.data && invites.data.length > 0 ? (
          invites.data.map(
            (invite) =>
              invite && (
                <Suspense key={invite.id} fallback={<List.CardPlaceholder />}>
                  <InviteCard {...invite} />
                </Suspense>
              )
          )
        ) : (
          <List.Empty
            title={'Get started with invites!'}
            description={`An empty community is pretty boring. Invite friends so you can chat around and even invite random people from the internet with invites!`}
            icon={faUsers}
            action={
              <Button
                type='button'
                onClick={() => ui.setModal({ name: ModalTypes.NEW_INVITE })}
              >
                Create Invite <FontAwesomeIcon icon={faPlusCircle} />
              </Button>
            }
          />
        )}
      </List.View>
    </div>
  )
}

const Invites = {
  View: InvitesView,
  Card: InviteCard
}

export default Invites
