import {
  FC,
  memo,
  Suspense,
  useEffect,
  useMemo,
  useState,
  useCallback
} from 'react'
import { useLocation, useMedia } from 'react-use'
// import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import { PrivateRoute } from './authentication/PrivateRoute'
import Community from './community/Community'
import { UI } from './state/ui'
import Settings from './settings/Settings'
import Conversation, { ConversationView } from './conversation/Conversation'
import Sidebar from './sidebar/Sidebar'
import { AnimatePresence } from 'framer-motion'
import Loader from './components/Loader'
import { Auth } from './authentication/state'
import Home from './marketing/Home'
import { isPlatform } from '@ionic/react'
import { Call } from './state/call'
import Current from './call/Current'
import EventSource from './events'
import Context from './components/Context'
import { Plugins } from '@capacitor/core'
import { clientGateway } from './utils/constants'
import Downloads from './marketing/Downloads'
import Invite from './invite/Invite'
import Admin from './admin/Admin'
import { useQuery } from 'react-query'
import { getCommunities } from './user/remote'
import OnBoarding from './marketing/OnBoarding'
import { useSuspenseStorageItem } from './utils/storage'
import Modal from './components/Modals'
import { Permission } from './utils/permissions'
import Hub from './hub/Hub'
import { useCommunities, useConversations } from './user/state'
import {
  Navigate,
  Outlet,
  ReactLocation,
  Router as BrowserRouter
} from 'react-location'
import { Login } from './authentication/Login'
import { Register } from './authentication/Register'
import { Conversations } from './conversation/Conversations'
import Empty from './conversation/empty/Empty'
import Sideview from './components/Sideview'
import { faStoreAlt } from '@fortawesome/free-solid-svg-icons'
import Friends from './hub/friends/Friends'
import Store from './hub/store/Store'
import Product from './hub/store/Product'

const { PushNotifications } = Plugins

const reactLocation = new ReactLocation()

const ContextMenuHandler: FC = () => {
  const uiStore = UI.useContainer()

  return uiStore.contextMenu ? (
    <Permission.Provider>
      <Context.Menu {...uiStore.contextMenu} />
    </Permission.Provider>
  ) : (
    <></>
  )
}

const IncomingCall: FC = () => {
  const auth = Auth.useContainer()
  const call = Call.useContainerSelector(({ room }) => ({ room }))
  const isMobile = useMedia('(max-width: 740px)')
  return auth.authenticated && isMobile ? (
    <>
      <Suspense fallback={<></>}>{call.room && <Current />}</Suspense>
    </>
  ) : (
    <></>
  )
}

// const MarketingRouter: FC = () => {
//   const auth = Auth.useContainer()
//   const isPWA = useMedia('(display-mode: standalone)')

//   return (
//     <Switch>
//       {!isPlatform('capacitor') && !isPWA ? (
//         <Route path='/home' component={Home} exact />
//       ) : (
//         <Redirect path='/home' to='/authenticate/login' exact />
//       )}
//       {isPlatform('capacitor') || isPWA ? (
//         <Redirect path='/downloads' to='/authenticate/login' exact />
//       ) : (
//         <PrivateRoute path='/downloads' component={Downloads} exact />
//       )}
//       <Route
//         path={'/invite/:invite/:code?'}
//         component={() => (
//           <>
//             {auth.authenticated && <Sidebar />}
//             <Invite />
//           </>
//         )}
//         exact
//       />
//       <Route path='/authenticate' component={Authenticate} />
//       {!auth.authenticated && (
//         <Redirect
//           path='/'
//           to={isPlatform('capacitor') ? '/authenticate/login' : '/home'}
//         />
//       )}
//     </Switch>
//   )
// }

// const OnboardingHandler: FC<{
//   onboardingStateChange: (state: boolean) => void
// }> = ({ onboardingStateChange }) => {
//   const auth = Auth.useContainer()

//   const [onboardingComplete] = useSuspenseStorageItem<boolean>(
//     'onboarding-complete',
//     false
//   )
//   const communities = useCommunities()
//   const conversations = useConversations()

//   const showOnBoarding = useMemo(() => {
//     return (
//       (communities?.length ?? 0) < 1 &&
//       (conversations?.length ?? 0) < 1 &&
//       !onboardingComplete
//     )
//   }, [communities?.length, conversations?.length, onboardingComplete])

//   useEffect(() => {
//     onboardingStateChange(showOnBoarding)
//   }, [showOnBoarding, onboardingStateChange])

//   return <></>
// }

// const AppRouter: FC = () => {
//   const auth = Auth.useContainer()
//   const isMobile = useMedia('(max-width: 740px)')
//   const isPWA = useMedia('(display-mode: standalone)')
//   const call = Call.useContainer()
//   useEffect(() => {
//     if (auth.authenticated && isPlatform('capacitor')) {
//       PushNotifications.addListener('registration', async (token) => {
//         await clientGateway.post(
//           `/users/${auth.id}/notifications`,
//           {
//             token: token.value,
//             platform: 'ios'
//           },
//           {
//             headers: {
//               authorization: auth.token
//             }
//           }
//         )
//       })

//       if (localStorage.getItem('requested-notifications') !== 'true') {
//         PushNotifications.requestPermission()
//           .then(async ({ granted }) => {
//             if (granted) {
//               await PushNotifications.register()
//               localStorage.setItem('requested-notifications', 'true')
//             }
//           })
//           .catch(console.error)
//       }
//     }
//     return () => {
//       if (isPlatform('capacitor')) PushNotifications.removeAllListeners()
//     }
//   }, [auth])

//   const [showOnBoarding, setShowOnBoarding] = useState(false)

//   const onboardingHandler = useCallback((state: boolean) => {
//     setShowOnBoarding(state)
//   }, [])

//   return (
//     <>
//       <OnboardingHandler onboardingStateChange={onboardingHandler} />
//       {/* <EventSource /> */}
//       <Suspense fallback={<></>}>
//         {showOnBoarding ? (
//           <OnBoarding />
//         ) : (
//           <>
//             <Switch>
//               <PrivateRoute
//                 path='/settings'
//                 render={() => (
//                   <>
//                     {isMobile && <Sidebar />}
//                     <Suspense fallback={<Loader />}>
//                       <Settings />
//                     </Suspense>
//                   </>
//                 )}
//               />
//               <PrivateRoute path={'/admin'} render={Admin} />
//               <PrivateRoute path='/communities/:id' render={Community} />
//               <PrivateRoute
//                 path={'/conversations'}
//                 render={Conversation}
//                 redirect={
//                   isPlatform('mobile') || isPWA
//                     ? '/authenticate/login'
//                     : '/home'
//                 }
//               />
//               <PrivateRoute
//                 path={'/hub'}
//                 render={() => (
//                   <>
//                     {isMobile && <Sidebar />}
//                     <Suspense fallback={<Loader />}>
//                       <Hub />
//                     </Suspense>
//                   </>
//                 )}
//               />
//               <Redirect path={'/'} to={'/conversations'} exact />
//             </Switch>
//           </>
//         )}
//       </Suspense>
//       {!isMobile && (
//         <>
//           <Suspense fallback={<></>}>{call.room && <Current />}</Suspense>
//         </>
//       )}
//       <IncomingCall />
//     </>
//   )
// }

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

  return (
    <>
      {showOnBoarding ? (
        <OnBoarding />
      ) : (
        <>
          <Sidebar />
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

const ConversationsLayout = () => {
  const conversations = useConversations()

  return (conversations?.length ?? 0) < 1 ? (
    <Empty />
  ) : (
    <>
      <Conversations />
      <Outlet />
    </>
  )
}

const HubLayout = () => {
  return (
    <>
      <Sideview
        name={'Hub'}
        tabs={[
          {
            name: 'Store',
            icon: faStoreAlt,
            color: 'primary',
            link: '/app/hub/store'
          }
        ]}
        children={<Friends />}
      />
      <Outlet />
    </>
  )
}

const Index = () => {
  const { authenticated } = Auth.useContainer()
  return authenticated ? <Navigate to={'/app'} /> : <Navigate to={'/home'} />
}

export const Router: FC = memo(() => {
  return (
    <div id='main'>
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
                    path: ':id',
                    element: <ConversationView />
                  }
                ]
              },
              {
                path: 'communities',
                children: [
                  {
                    path: ':id',
                    element: <></>
                  }
                ]
              },
              {
                path: 'settings',
                element: <></>
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
    </div>
  )
})
