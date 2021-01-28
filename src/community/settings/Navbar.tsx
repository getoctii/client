import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styles from './Navbar.module.scss'

export const Navbar = () => {
  const match = useRouteMatch<{ tab?: string; id: string }>(
    '/communities/:id/settings/:tab?'
  )
  const history = useHistory()
  return (
    <ul className={styles.navbar}>
      <li
        onClick={() =>
          history.push(`/communities/${match?.params.id}/settings/general`)
        }
        className={match?.params.tab === 'general' ? styles.selected : ''}
      >
        General
      </li>
      <li
        onClick={() =>
          history.push(`/communities/${match?.params.id}/settings/invites`)
        }
        className={match?.params.tab === 'invites' ? styles.selected : ''}
      >
        Invites
      </li>
      <li
        onClick={() =>
          history.push(`/communities/${match?.params.id}/settings/groups`)
        }
        className={match?.params.tab === 'groups' ? styles.selected : ''}
      >
        Groups
      </li>
    </ul>
  )
}
