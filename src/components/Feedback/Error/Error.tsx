import { FC } from 'react'
import styles from './Error.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faPoo } from '@fortawesome/pro-solid-svg-icons'
import { Button } from '@/components/Form'
import queryClient from '@/utils/queryClient'

const Error: FC<{
  className?: string
  resetErrorBoundary: () => void
  error: any
}> = ({ className, resetErrorBoundary, error }) => {
  const isInvalidAuth =
    error?.isAxiosError &&
    error.response?.status === 403 &&
    error.response?.data.errors?.includes('InvalidAuthorization')
  if (isInvalidAuth) {
    return (
      <div className={`${styles.error} ${className ? className : ''}`}>
        <FontAwesomeIcon icon={faLock} size='4x' />
        <h1>Whoops, looks like this is an invalid login.</h1>
        <p>You can simply click, logout to go back the sign up page!</p>
        <Button
          type='button'
          onClick={async () => {
            await localStorage.clear()
            await queryClient.invalidateQueries()
            window.location.pathname = '/authenticate/login'
          }}
        >
          Logout
        </Button>
      </div>
    )
  }
  return (
    <div className={styles.error}>
      <FontAwesomeIcon icon={faPoo} size='4x' />
      <h1>
        {error?.isAxiosError
          ? error.response?.status ||
            (error.message === 'Network Error' ? 'Gateway Down!' : 'Beep Boop!')
          : 'Beep Boop!'}
      </h1>
      <p>Beep Boooop Beeep Beeep Booooop Beep Boop Bep</p>
      <Button type='button' onClick={() => resetErrorBoundary()}>
        Try again
      </Button>
    </div>
  )
}

export default Error
