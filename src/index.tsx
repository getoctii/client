import './polyfills'
import { StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import '@fontsource/inter/variable.css'
import { Router } from './Router'
import { ReactQueryDevtools } from 'react-query-devtools'
import { Auth } from '@/state/auth'
import { QueryClientProvider, QueryErrorResetBoundary } from 'react-query'
import { Loader, Error } from '@/components/Feedback'
import { UI } from './state/ui'
import '@sentry/browser'
import * as Sentry from '@sentry/react'
import SentryRRWeb from '@sentry/rrweb'
import { Theme } from '@/state/theme'
import Typing from '@/state/typing'
import { ScrollPosition } from './state/scroll'
import { Call } from '@/state/call'
import { Chat } from '@/state/chat'
import { Integrations } from '@sentry/tracing'
import { HelmetProvider } from 'react-helmet-async'
// @ts-ignore
import smoothscroll from 'smoothscroll-polyfill'
import Integration from '@/state/integrations'
import { Keychain } from '@/state/keychain'
import queryClient from './utils/queryClient'
smoothscroll.polyfill()

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://6f9ffeb08c814b15971d8241698bee28@o271654.ingest.sentry.io/5541960',
    integrations: [new SentryRRWeb(), new Integrations.BrowserTracing()],
    release: import.meta.env.VITE_APP_VERSION,
    tracesSampleRate: 0.5
  })
}

console.log(
  `%cHey!

If anyone told you to paste something here, they're deceiving you. Anything pasted here has access to your account. Thank you for using Octii!

With love,
Lleyton

P.S. If you do know what you're doing, maybe you should join us :P.
lleyton@innatical.com
`,
  'font-size: 18px; font-family: Inter, sans-serif; font-weight: 600'
)

// setFocusHandler((handleFocus) => {
//   const listener = App.addListener('appStateChange', (state: AppState) => {
//     if (state.isActive) {
//       handleFocus()
//     }
//   })

//   return () => {
//     listener.remove()
//   }
// })

addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

ReactDOM.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <Sentry.ErrorBoundary
            onReset={reset}
            fallback={({ resetError, error }) => (
              <Error resetErrorBoundary={resetError} error={error} />
            )}
          >
            <Suspense fallback={<Loader />}>
              <HelmetProvider>
                <Auth.Provider>
                  <UI.Provider>
                    <Typing.Provider>
                      <Call.Provider>
                        <Keychain.Provider>
                          <Chat.Provider>
                            <Integration.Provider>
                              <Theme.Provider>
                                <ScrollPosition.Provider>
                                  <Router />
                                </ScrollPosition.Provider>
                              </Theme.Provider>
                            </Integration.Provider>
                          </Chat.Provider>
                        </Keychain.Provider>
                      </Call.Provider>
                    </Typing.Provider>
                  </UI.Provider>
                </Auth.Provider>
              </HelmetProvider>
              <ReactQueryDevtools />
            </Suspense>
          </Sentry.ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </QueryClientProvider>
  </StrictMode>,
  document.getElementById('root')
)

// if (!isPlatform('capacitor')) {
//   serviceWorkerRegistration.register({
//     onUpdate: (registration) => {
//       const waitingServiceWorker = registration.waiting
//       if (waitingServiceWorker) {
//         waitingServiceWorker.addEventListener('statechange', (event) => {
//           // @ts-ignore
//           if (event?.target?.state === 'activated') {
//             window.location.reload()
//           }
//         })
//       }
//       // @ts-ignore
//       window.waitingServiceWorker = waitingServiceWorker
//       // @ts-ignore
//       window.setModal({ name: ModalTypes.UPDATE })
//     }
//   })
// }
