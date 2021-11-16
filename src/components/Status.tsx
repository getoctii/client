import {
  faCircle,
  faMoon,
  faSignOutAlt,
  faStopCircle,
  faTimesCircle
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import queryClient from '../utils/queryClient'
import { Auth } from '@/state/auth'
import { clientGateway } from '../utils/constants'
import { UI } from '../state/ui'
import { State } from '@/api/users'
import { Button, Input } from '@/components/Form'
import styles from './Status.module.scss'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { BarLoader } from 'react-spinners'
import * as Yup from 'yup'
import { useCurrentUser } from '@/hooks/users'

const updateStatus = async (id: string, state: State, token: string) => {
  await clientGateway.patch(
    `/users/${id}`,
    { state },
    {
      headers: {
        authorization: token
      }
    }
  )
  await queryClient.refetchQueries(['users', id, token])
}

const StatusSchema = Yup.object().shape({
  status: Yup.string()
    .min(2, 'Too short, must be at least 2 characters.')
    .max(140, 'Too long, must be less then 140 characters.')
})

const Status: FC<{ isClosable?: boolean }> = ({ isClosable = true }) => {
  const { id, token } = Auth.useContainer()
  const ui = UI.useContainer()
  const user = useCurrentUser()
  return (
    <div className={styles.status}>
      <h1>
        Status
        {isClosable ? (
          <span onClick={() => ui.clearModal()}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </span>
        ) : (
          <></>
        )}
      </h1>
      <div className={styles.statusButtons}>
        <Button
          type='button'
          className={`${styles.online} ${
            user?.state == State.ONLINE ? styles.active : null
          }`}
          onClick={() => id && token && updateStatus(id, State.ONLINE, token)}
        >
          <FontAwesomeIcon icon={faCircle} />
        </Button>
        <Button
          type='button'
          className={`${styles.idle} ${
            user?.state == State.IDLE ? styles.active : null
          }`}
          onClick={() => id && token && updateStatus(id, State.IDLE, token)}
        >
          <FontAwesomeIcon icon={faMoon} />
        </Button>
        <Button
          type='button'
          className={`${styles.dnd} ${
            user?.state == State.DND ? styles.active : null
          }`}
          onClick={() => id && token && updateStatus(id, State.DND, token)}
        >
          <FontAwesomeIcon icon={faStopCircle} />
        </Button>
        <Button
          type='button'
          className={`${styles.offline} ${
            user?.state == State.OFFLINE ? styles.active : null
          }`}
          onClick={() => id && token && updateStatus(id, State.OFFLINE, token)}
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
        </Button>
      </div>
      <div>
        <Formik
          initialValues={{
            status: user?.status ?? ''
          }}
          validationSchema={StatusSchema}
          onSubmit={async ({ status }, { setSubmitting }) => {
            try {
              await clientGateway.patch(
                `/users/${id}`,
                {
                  status
                },
                {
                  headers: {
                    authorization: token
                  }
                }
              )
              await queryClient.invalidateQueries(['users', id])
            } finally {
              setSubmitting(false)
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className={styles.form}>
              <Field
                component={Input}
                name='status'
                placeholder='What are you up to?'
              />
              <ErrorMessage component='p' name='status' />
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? <BarLoader color='#ffffff' /> : 'Update Status'}
              </Button>

              {/* <div
                className={styles.logout}
                onClick={async () => {
                  auth.setToken(null)
                  await queryClient.invalidateQueries()
                  await Plugins.Storage.clear()
                  history.push('/authenticate/login')
                }}
              >
                Logout
              </div> */}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Status
