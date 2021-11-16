import { FC } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import styles from './styles.module.scss'
import { register } from '@/api/auth'
import { BarLoader } from 'react-spinners'
import { Auth } from '@/state/auth'
import * as Yup from 'yup'
import axios from 'axios'
import { Heading, Wrapper } from './styles'
import { Link, useNavigate } from 'react-location'
import { Keychain } from '@/state/keychain'

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email'),
  password: Yup.string()
    .min(8, 'Too short, password must be at least 8 characters.')
    .max(140, 'Too long, password must be under 140 characters.'),
  username: Yup.string()
    .min(3, 'Too short, username must be at least 3 characters.')
    .max(16, 'Too long, username must be under 16 characters.')
    .matches(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric.')
})

export const Register: FC = () => {
  const auth = Auth.useContainer()
  const { setKeychain } = Keychain.useContainer()
  const navigate = useNavigate()
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        username: ''
      }}
      validationSchema={RegisterSchema}
      onSubmit={async (values, { setSubmitting, setErrors, setFieldError }) => {
        if (!values?.username || !values?.email || !values?.password) {
          !values?.username && setFieldError('username', 'Required')
          !values?.email && setFieldError('email', 'Required')
          !values?.password && setFieldError('password', 'Required')
          return
        }
        try {
          const response = await register(values)
          if (response) {
            auth.setToken(response.token)
            setKeychain(response.keychain)
            navigate({ to: '/app' })
          }
        } catch (e) {
          if (axios.isAxiosError(e)) {
            const error = e.response?.data?.errors
            switch (error) {
              case 'UsernameTaken':
                setErrors({
                  email: 'This username is already in use'
                })
                break
              case 'EmailInUse':
                setErrors({
                  password: 'This email is already in use'
                })
                break
              default:
                return
            }
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
            />
            <ErrorMessage component='p' className={styles.error} name='email' />

            <label htmlFor='username' className={styles.label}>
              Username
            </label>
            <Field
              className={styles.input}
              id='username'
              name='username'
              type='text'
            />
            <ErrorMessage
              component='p'
              className={styles.error}
              name='username'
            />

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

            <button
              className={styles.button}
              type='submit'
              disabled={isSubmitting}
            >
              {isSubmitting ? <BarLoader color='#ffffff' /> : 'Register'}
            </button>
            <Link to={'/login'}>Already Registered?</Link>
          </Form>
        </Wrapper>
      )}
    </Formik>
  )
}
