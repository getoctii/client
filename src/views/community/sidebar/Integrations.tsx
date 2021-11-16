import { faAddressBook, faUserCog } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo, FC } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styles from './Integrations.module.scss'
import { Permission } from '../../../utils/permissions'
import { Permissions } from '../../../utils/constants'
import { faWarehouse } from '@fortawesome/pro-solid-svg-icons'
import { useNavigate } from 'react-location'
import { CommunityFlag } from '@/api/communities'

const IntegrationsView: FC = () => {
  const navigate = useNavigate()
  const { community, hasPermissions } = Permission.useContainer()

  return (
    <div className={styles.integrations}>
      <div
        key='members'
        className={
          'members' ? `${styles.members} ${styles.selected}` : styles.members
        }
        onClick={() => {
          if (community)
            navigate({ to: `/communities/${community.id}/members` })
        }}
      >
        <h4>
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faAddressBook} fixedWidth={true} />
          </div>
          Members
        </h4>
      </div>
      {community?.flags?.includes(CommunityFlag.DEVELOPER) &&
        hasPermissions([Permissions.ADMINISTRATOR]) && (
          <div>
            <hr className={'products' ? styles.hidden : ''} />
            <div
              key='products'
              className={
                'products'
                  ? `${styles.products} ${styles.selected}`
                  : styles.products
              }
              onClick={() => {
                if (community)
                  navigate({ to: `/communities/${community.id}/products` })
              }}
            >
              <h4>
                <div className={styles.icon}>
                  <FontAwesomeIcon icon={faWarehouse} fixedWidth={true} />
                </div>
                Products
              </h4>
            </div>
          </div>
        )}
      {hasPermissions([
        Permissions.MANAGE_GROUPS,
        Permissions.MANAGE_COMMUNITY,
        Permissions.MANAGE_INVITES
      ]) && (
        <div>
          <hr className={'members' ? styles.hidden : ''} />
          <div
            key='settings'
            className={
              'settings'
                ? `${styles.settings} ${styles.selected}`
                : styles.settings
            }
            onClick={() => {
              if (community)
                navigate({
                  to: `/communities/${community.id}/settings/general`
                })
            }}
          >
            <h4>
              <div className={styles.icon}>
                <FontAwesomeIcon icon={faUserCog} fixedWidth={true} />
              </div>
              Settings
            </h4>
          </div>
        </div>
      )}
    </div>
  )
}

const Placeholder: FC = () => {
  const integrationOne = useMemo(() => Math.floor(Math.random() * 5) + 3, [])
  const integrationTwo = useMemo(() => Math.floor(Math.random() * 6) + 3, [])
  return (
    <div className={styles.placeholder}>
      <div className={styles.integration}>
        <div className={styles.icon} />
        <div
          className={styles.text}
          style={{ width: `${integrationOne}rem` }}
        />
      </div>
      <hr />
      <div className={styles.integration}>
        <div className={styles.icon} />
        <div
          className={styles.text}
          style={{ width: `${integrationTwo}rem` }}
        />
      </div>
    </div>
  )
}

const Integrations = { View: IntegrationsView, Placeholder }

export default Integrations
