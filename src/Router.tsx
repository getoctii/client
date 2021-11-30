import { FC, memo, Suspense, useEffect, useMemo } from 'react'
import { UI } from '@/state/ui'
import Conversation from './views/conversation/Conversation'
import { SideBar } from '@/components/Layout'
import { AnimatePresence } from 'framer-motion'
import { Auth } from '@/state/auth'
import { Home, Downloads, OnBoarding } from './views/Marketing'
import { Call } from '@/state/call'
import { Current } from '@/modals/Call'
import EventSource from './events'
import { ContextMenu } from '@/components/Overlay'
import { useSuspenseStorageItem } from '@/utils/storage'
import Modal from '@/components/Modals'
import { Permission } from '@/utils/permissions'
import { useCommunities, useConversations } from '@/hooks/users'
import {
  Navigate,
  Outlet,
  ReactLocation,
  Router as BrowserRouter,
  useNavigate
} from 'react-location'
import { Login } from './views/authentication/Login'
import { Register } from './views/authentication/Register'
import { ConversationList, ConversationEmpty } from '@/domain/Conversation'
import { SideView } from '@/components/Layout'
import {
  faPaintBrush,
  faShieldAlt,
  faStoreAlt,
  faUser
} from '@fortawesome/pro-solid-svg-icons'
import { FriendList } from '@/domain/Hub'
import { SideBar as CommunitySideBar } from '@/domain/Community'
import Channel from './views/chat/Channel'
import Profile from './views/settings/Profile'
import { Status } from '@/domain/User'
import { ThemeProvider } from 'styled-components'
import { Theme } from './state/theme'

const reactLocation = new ReactLocation()

const ContextMenuHandler: FC = () => {
  const uiStore = UI.useContainer()

  return uiStore.contextMenu ? (
    <Permission.Provider>
      <ContextMenu.Menu {...uiStore.contextMenu} />
    </Permission.Provider>
  ) : (
    <></>
  )
}

const IncomingCall: FC = () => {
  const auth = Auth.useContainer()
  const call = Call.useContainerSelector(({ room }) => ({ room }))

  return auth.authenticated ? (
    <>
      <Suspense fallback={<></>}>{call.room && <Current />}</Suspense>
    </>
  ) : (
    <></>
  )
}

const AppLayout = () => {
  const [onboardingComplete] = useSuspenseStorageItem<boolean>(
    'onboarding-complete',
    false
  )

  const communities = useCommunities()
  const conversations = useConversations()

  const showOnBoarding = useMemo(() => {
    return (
      (communities?.length ?? 0) < 1 &&
      (conversations?.length ?? 0) < 1 &&
      !onboardingComplete
    )
  }, [communities?.length, conversations?.length, onboardingComplete])

  const auth = Auth.useContainer()
  if (!auth.authenticated) return <Navigate to='/login' />
  return (
    <>
      {auth.authenticated && showOnBoarding ? (
        <OnBoarding />
      ) : (
        <>
          <SideBar />
          <Outlet />
        </>
      )}
      <Suspense fallback={<></>}>
        <AnimatePresence>
          <Modal key='modals' />
          <ContextMenuHandler key='contextmenu' />
        </AnimatePresence>
      </Suspense>
      <EventSource />
    </>
  )
}

const CommunityLayout = () => {
  return (
    <Permission.Provider>
      <CommunitySideBar.View />
      <Outlet />
    </Permission.Provider>
  )
}

const ConversationsLayout = () => {
  const conversations = useConversations()

  return (conversations?.length ?? 0) < 1 ? (
    <ConversationEmpty />
  ) : (
    <>
      <ConversationList />
      <Outlet />
    </>
  )
}

const HubLayout = () => {
  return (
    <>
      <SideView
        name={'Hub'}
        tabs={[
          {
            name: 'Store',
            icon: faStoreAlt,
            color: 'primary',
            link: '/app/hub/store'
          }
        ]}
        children={<FriendList />}
      />
      <Outlet />
    </>
  )
}

const SettingsLayout = () => {
  return (
    <>
      <SideView
        name={'Settings'}
        tabs={[
          {
            name: 'Profile',
            icon: faUser,
            color: 'primary',
            link: '/settings/profile'
          },
          {
            name: 'Security',
            icon: faShieldAlt,
            color: 'danger',
            link: '/settings/security'
          },
          {
            name: 'Themes',
            icon: faPaintBrush,
            color: 'warning',
            link: '/settings/themes'
          }
        ]}
      >
        <Status />
      </SideView>
      <Outlet />
    </>
  )
}
const Index = () => {
  const { authenticated } = Auth.useContainer()
  return authenticated ? <Navigate to={'/app'} /> : <Navigate to={'/home'} />
}

const ConversationRedirect = () => {
  const [lastConversation] = useSuspenseStorageItem<string>('last-conversation')
  const conversations = useConversations()
  const navigate = useNavigate()

  useEffect(() => {
    if (lastConversation)
      navigate({ to: `/app/conversations/${lastConversation}` })
    else navigate({ to: `/app/conversations/${conversations[0]}` })
  }, [lastConversation, navigate, conversations])
  return <></>
}

export const Router: FC = memo(() => {
  const call = Call.useContainer()
  const theme = Theme.useContainer()
  return (
    <div id='main'>
      <ThemeProvider theme={theme.currentTheme}>
        <BrowserRouter
          location={reactLocation}
          routes={[
            {
              path: '/',
              element: <Index />
            },
            {
              path: 'home',
              element: <Home />
            },
            { path: 'downloads', element: <Downloads /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            {
              path: 'app',
              element: <AppLayout />,
              children: [
                {
                  path: '/',
                  element: <Navigate to={'/app/conversations'} />
                },
                {
                  path: 'conversations',
                  element: <ConversationsLayout />,
                  children: [
                    {
                      path: '/',
                      element: <ConversationRedirect />
                    },
                    {
                      path: ':id',
                      element: <Conversation />
                    }
                  ]
                },
                {
                  path: 'communities',
                  children: [
                    {
                      path: ':id',
                      element: <CommunityLayout />,
                      children: [
                        {
                          path: 'channels/:channelID',
                          children: [
                            {
                              path: '/',
                              element: <Channel.Community />
                            },
                            {
                              path: 'settings',
                              element: <></>
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  path: 'settings',
                  element: <SettingsLayout />,
                  children: [
                    {
                      path: '/',
                      element: <Navigate to={'/app/settings/profile'} />
                    },
                    {
                      path: 'profile',
                      element: <Profile />
                    }
                  ]
                },
                {
                  path: 'hub',
                  element: <HubLayout />,
                  children: [
                    {
                      path: '/',
                      element: <Navigate to={'/app/hub/store'} />
                    },
                    {
                      path: 'store',
                      element: <></>,
                      children: [
                        {
                          path: ':productID',
                          element: <></>
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]}
        />

        <Suspense fallback={<></>}>{call.room && <Current />}</Suspense>

        <IncomingCall />
      </ThemeProvider>
    </div>
  )
})
