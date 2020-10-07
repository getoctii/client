// import './wdyr'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import 'typeface-inter'
import * as serviceWorker from './serviceWorker'
import { Router } from './Router'
import { ReactQueryDevtools } from 'react-query-devtools'
import { Auth } from './authentication/state'
import { queryCache, ReactQueryConfigProvider } from 'react-query'
import { ErrorBoundary } from 'react-error-boundary'
import Loader from './components/Loader'
import Error from './components/Error'
import EventSource from './EventSource'
import { UI } from './uiStore'
import * as Sentry from '@sentry/react'
import { LocalNotifications } from '@capacitor/core'
import Theme from './theme/hook'
import Typing from './typing'

console.log(
  '%c+',
  `background: url("https://file.coffee/u/wkV2Mrh7bl.png"); background-size: 500px 696px; color: transparent; font-size: 1px; padding: 348px 250px; line-height: 696px;`
)
console.log(
  `%cHey!

If anyone told you to paste something here, they're deceiving you. Anything pasted here has access to your account. Thank you for using Octii!

With love,
Octii-chan and Lleyton

P.S. If you do know what you're doing, maybe you should join us :P.
lleyton@innatical.com
`,
  'font-size: 18px; font-family: Inter, sans-serif; font-weight: 600'
)

Sentry.init({
  dsn:
    'https://ed58056045ea4fb599148359fa30aac0@o271654.ingest.sentry.io/5400867',
  release: process.env.REACT_APP_VERSION
})

LocalNotifications.requestPermission().catch(() =>
  console.warn('Notifications not supported')
)

document.oncontextmenu = (event) => {
  event.preventDefault()
}

ReactDOM.render(
  <React.StrictMode>
    <ReactQueryConfigProvider
      config={{
        shared: {
          suspense: true
        }
      }}
    >
      <ErrorBoundary
        onReset={() => queryCache.resetErrorBoundaries()}
        fallbackRender={({ resetErrorBoundary }) => (
          <Error resetErrorBoundary={resetErrorBoundary} />
        )}
      >
        <React.Suspense fallback={<Loader />}>
          {/* fucking provider hell */}
          <Auth.Provider>
            <UI.Provider>
              <Typing.Provider>
                <Theme.Provider>
                  <Router />
                  <EventSource />
                </Theme.Provider>
              </Typing.Provider>
            </UI.Provider>
          </Auth.Provider>
          <ReactQueryDevtools />
        </React.Suspense>
      </ErrorBoundary>
    </ReactQueryConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
