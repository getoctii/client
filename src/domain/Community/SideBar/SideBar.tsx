import { faEllipsisH } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IntegrationList, ChannelList } from '@/domain/Community'
import { useState, FC } from 'react'
import { useMutation } from 'react-query'
import { useRouteMatch } from 'react-router-dom'
import { Auth } from '@/state/auth'
import styles from './Sidebar.module.scss'
import {
  clientGateway,
  ModalTypes,
  Permissions
} from '../../../utils/constants'
import { useSuspenseStorageItem } from '../../../utils/storage'
import { Permission } from '../../../utils/permissions'
import {
  faBell,
  faBellSlash,
  faSignOutAlt,
  faUserPlus
} from '@fortawesome/pro-solid-svg-icons'
import { UI } from '../../../state/ui'
import { useMatch } from 'react-location'
import { useCommunity } from '@/hooks/communities'

const SidebarView: FC = () => {
  const auth = Auth.useContainer()
  const {
    params: { id }
  } = useMatch()
  const [menu, setMenu] = useState(false)
  const [muted, setMuted] = useSuspenseStorageItem<string[]>(
    'muted-communities',
    []
  )
  const community = useCommunity(id)
  console.log(community)
  const ui = UI.useContainer()
  const { hasPermissions } = Permission.useContainer()
  const leaveCommunity = useMutation(
    async () =>
      (
        await clientGateway.post(
          `/communities/${id}/leave`,
          {},
          {
            headers: { Authorization: auth.token }
          }
        )
      ).data
  )
  return (
    <div className={styles.sidebarWrapper}>
      <div className={styles.sidebar}>
        <h3>
          {community?.name ? community?.name : ''}{' '}
          <span
            className={styles.leave}
            onClick={() => {
              setMenu(!menu)
            }}
          >
            <FontAwesomeIcon icon={faEllipsisH} className={styles.menuIcon} />
          </span>
        </h3>
        {menu && (
          <div className={styles.menu}>
            {hasPermissions([
              Permissions.CREATE_INVITES,
              Permissions.MANAGE_INVITES
            ]) && (
              <div
                className={styles.menuItem}
                onClick={() => ui.setModal({ name: ModalTypes.NEW_INVITE })}
              >
                <span>Create Invite</span>{' '}
                <FontAwesomeIcon icon={faUserPlus} fixedWidth />
              </div>
            )}
            <div
              className={styles.menuItem}
              onClick={() => {
                if (!community?.id) return
                if (muted?.includes(community.id))
                  setMuted(
                    muted.filter((communities) => communities !== community?.id)
                  )
                else setMuted([...(muted || []), community.id])
              }}
            >
              {community && muted?.includes(community.id) ? (
                <>
                  <span>Unmute Community</span>{' '}
                  <FontAwesomeIcon icon={faBell} fixedWidth />
                </>
              ) : (
                <>
                  <span>Mute Community</span>{' '}
                  <FontAwesomeIcon icon={faBellSlash} fixedWidth />
                </>
              )}
            </div>
            {community?.ownerID !== auth.id && (
              <>
                <hr />
                <div
                  className={`${styles.menuItem} ${styles.danger}`}
                  onClick={async () => {
                    await leaveCommunity.mutate()
                  }}
                >
                  <span>Leave Community</span>{' '}
                  <FontAwesomeIcon icon={faSignOutAlt} fixedWidth />
                </div>
              </>
            )}
          </div>
        )}
        <IntegrationList.View />
        <ChannelList.View />
      </div>
    </div>
  )
}

const SidebarPlaceholder: FC = () => {
  return (
    <div className={styles.placeholder}>
      <div className={styles.sidebar}>
        <div className={styles.container}>
          <div className={styles.name} />
        </div>
        <IntegrationList.Placeholder />
        <ChannelList.Placeholder />
      </div>
    </div>
  )
}

const Sidebar = { View: SidebarView, Placeholder: SidebarPlaceholder }

export default Sidebar
