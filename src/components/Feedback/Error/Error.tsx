import { FC } from 'react'
import styles from './Error.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faPoo } from '@fortawesome/pro-solid-svg-icons'
import { Button } from '@/components/Form'
import queryClient from '@/utils/queryClient'
import axios from 'axios'
import { StyledError } from './Error.style'

const Error: FC<{
  className?: string
  resetErrorBoundary?: () => void
  error: Error
}> = ({ className, resetErrorBoundary, error }) => {
  const isInvalidAuth =
    axios.isAxiosError(error) &&
    error.response?.status === 403 &&
    error.response?.data.errors?.includes('InvalidAuthorization')
  if (isInvalidAuth) {
    return (
      <StyledError className={className ? className : ''}>
        <FontAwesomeIcon icon={faLock} size='4x' />
        <h1>Whoops, looks like this is an invalid login.</h1>
        <p>You can simply click, logout to go back the sign up page!</p>
        <Button
          type='button'
          danger
          onClick={async () => {
            await localStorage.clear()
            await queryClient.invalidateQueries()
            window.location.pathname = '/login'
          }}
        >
          Logout
        </Button>
      </StyledError>
    )
  }
  return (
    <StyledError>
      <FontAwesomeIcon icon={faPoo} size='4x' />
      <h1>
        {axios.isAxiosError(error)
          ? error.response?.status ||
            (error.message === 'Network Error' ? 'Gateway Down!' : 'Beep Boop!')
          : 'Beep Boop!'}
      </h1>
      <p>Beep Boooop Beeep Beeep Booooop Beep Boop Bep</p>
      <Button
        type='button'
        danger
        onClick={() => resetErrorBoundary && resetErrorBoundary()}
      >
        Try again
      </Button>
    </StyledError>
  )
}

export default Error
