import { FC, Suspense, useMemo } from 'react'
import Lookup from './Lookup'
import { useMedia } from 'react-use'
import { Redirect, Switch, useRouteMatch } from 'react-router-dom'
import { PrivateRoute } from '../authentication/PrivateRoute'
import styles from './Admin.module.scss'
import Codes from './Codes'
import Newsletters from './Newsletters'
import { SideView, SideBar } from '@/components/Layout'
import {
  faClipboardList,
  faNewspaper,
  faStreetView
} from '@fortawesome/pro-solid-svg-icons'
// import GitInfo from 'react-git-info/macro'
// import dayjs from 'dayjs'
import Queue from './store/Queue'
import { StatusBar } from '@/components/Layout'
import { useCurrentUser } from '@/hooks/users'

// const gitInfo = GitInfo()

const Admin: FC = () => {
  const isMobile = useMedia('(max-width: 740px)')
  const { path } = useRouteMatch()
  const match = useRouteMatch<{ page: string }>('/admin/:page')
  const user = useCurrentUser()

  const tabs = useMemo(() => {
    const items = [
      {
        name: 'Lookup',
        icon: faStreetView,
        color: 'primary',
        link: '/admin/lookup'
      },
      {
        name: 'Codes',
        icon: faClipboardList,
        color: 'secondary',
        link: '/admin/codes'
      },
      {
        name: 'Newsletters',
        icon: faNewspaper,
        color: 'warning',
        link: '/admin/newsletters'
      },
      {
        name: 'Queue',
        icon: faClipboardList,
        color: 'danger',
        link: '/admin/queue'
      }
    ]
    return items
  }, [])

  if (user && user.discriminator) throw new Error('InvalidAuthorization')
  return user?.discriminator === 0 ? (
    <>
      {isMobile && !match && <SideBar />}
      <StatusBar sidebar={!match}>
        <div className={styles.admin}>
          {!isMobile && (
            <SideView name={'Admin'} tabs={tabs}>
              {/* <p className={styles.buildInfo}>
                <strong>Branch:</strong> <kbd>{gitInfo.branch}</kbd>
                <br />
                <strong>Hash:</strong> <kbd>{gitInfo.commit.shortHash}</kbd>
                <br />
                <strong>Date:</strong>{' '}
                <kbd>{dayjs(gitInfo.commit.date).calendar()}</kbd>
                <br />
                <strong>Message:</strong>
                <br />
                <kbd>{gitInfo.commit.message}</kbd>
              </p> */}
            </SideView>
          )}
          <div className={styles.pages}>
            <Suspense fallback={<></>}>
              <Switch>
                {!isMobile ? (
                  <Redirect path={path} to={`${path}/lookup`} exact />
                ) : (
                  <PrivateRoute
                    path={path}
                    exact
                    component={() => (
                      <SideView name={'Admin'} tabs={tabs}>
                        {/* <p className={styles.buildInfo}>
                          <strong>Branch:</strong> <kbd>{gitInfo.branch}</kbd>
                          <br />
                          <strong>Hash:</strong>{' '}
                          <kbd>{gitInfo.commit.shortHash}</kbd>
                          <br />
                          <strong>Date:</strong>{' '}
                          <kbd>{dayjs(gitInfo.commit.date).calendar()}</kbd>
                          <br />
                          <strong>Message:</strong>
                          <br />
                          <kbd>{gitInfo.commit.message}</kbd>
                        </p> */}
                      </SideView>
                    )}
                  />
                )}
                <PrivateRoute
                  path={`${path}/lookup`}
                  component={Lookup}
                  exact
                />
                <PrivateRoute path={`${path}/codes`} component={Codes} exact />
                <PrivateRoute
                  path={`${path}/newsletters`}
                  component={Newsletters}
                  exact
                />
                <PrivateRoute path={`${path}/queue`} component={Queue} exact />
              </Switch>
            </Suspense>
          </div>
        </div>
      </StatusBar>
    </>
  ) : (
    <></>
  )
}

export default Admin
