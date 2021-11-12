import { ErrorMessage, Field, Form, Formik } from 'formik'
import styles from './styles.module.scss'
import { login } from '../remote'
import { BarLoader } from 'react-spinners'
import { Auth } from '../state'
import * as Yup from 'yup'
import { FC } from 'react'
import { UI } from '../../state/ui'
import { ModalTypes } from '../../utils/constants'
import axios from 'axios'
import { Heading, Wrapper } from './styles'
import { Link, useNavigate } from 'react-location'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email'),
  password: Yup.string()
    .min(8, 'Too short, password must be at least 8 characters.')
    .max(140, 'Too long, password must be under 140 characters.')
})

export const Login: FC = () => {
  const navigate = useNavigate()
  const auth = Auth.useContainer()
  const ui = UI.useContainer()

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={async (values, { setSubmitting, setErrors, setFieldError }) => {
        if (!values?.email || !values?.password) {
          !values?.email && setFieldError('email', 'Required')
          !values?.password && setFieldError('password', 'Required')
          return
        }
        try {
          const response = await login(values, async () => {
            return new Promise((resolve, reject) => {
              ui.setModal({
                name: ModalTypes.CODE_PROMPT,
                props: { onCode: resolve, onClose: reject }
              })
            })
          })
          if (response) {
            auth.setToken(response.token)
            navigate({ to: '/app' })
          }
        } catch (e) {
          if (axios.isAxiosError(e)) {
            const error = e.response?.data?.errors ?? ['UserNotFound']
            switch (error) {
              case 'UserNotFound':
                setErrors({
                  email: 'A user with that email could not be found'
                })
                break
              case 'InvalidSignature':
                setErrors({
                  password: 'Invalid password'
                })
                break
              default:
                return
            }
          } else {
            setErrors({
              password: 'Invalid password'
            })
          }
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {({ isSubmitting }) => (
        <Wrapper>
          <Form>
            <Heading>Octii</Heading>
            <p>The chat platform of the future</p>
            <label htmlFor='email' className={styles.label}>
              Email
            </label>
            <Field
              className={styles.input}
              id='email'
              name='email'
              type='email'
              enterKeyHint='next'
            />
            <ErrorMessage component='p' className={styles.error} name='email' />

            <label htmlFor='password' className={styles.label}>
              Password
            </label>
            <Field
              className={styles.input}
              id='password'
              name='password'
              type='password'
            />
            <ErrorMessage
              component='p'
              className={styles.error}
              name='password'
            />
            {/*TODO: Currently at #ffffff for testing, add theming support*/}
            <button
              className={styles.button}
              type='submit'
              disabled={isSubmitting}
            >
              {isSubmitting ? <BarLoader color='#ffffff' /> : 'Login'}
            </button>
            <Link to={'/register'}>Not Registered?</Link>
          </Form>
        </Wrapper>
      )}
    </Formik>
  )
}
