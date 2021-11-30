import { Form, Formik } from 'formik'

import { login } from '@/api/auth'
import { BarLoader } from 'react-spinners'
import { Auth } from '@/state/auth'
import * as Yup from 'yup'
import { FC } from 'react'
import { UI } from '@/state/ui'
import { ModalTypes } from '@/utils/constants'
import axios from 'axios'
import {
  StyledLogin,
  StyledLoginButton,
  StyledLoginError,
  StyledLoginHeading,
  StyledLoginInput,
  StyledLoginLabel
} from './Login.style'
import { Link, useNavigate } from 'react-location'
import { Keychain } from '@/state/keychain'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email'),
  password: Yup.string()
    .min(8, 'Too short, password must be at least 8 characters.')
    .max(140, 'Too long, password must be under 140 characters.')
})

const Login: FC = () => {
  const navigate = useNavigate()
  const { setKeychain } = Keychain.useContainer()
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
            setKeychain(response.keychain)
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
        <StyledLogin>
          <Form>
            <StyledLoginHeading>Octii</StyledLoginHeading>
            <p>The chat platform of the future</p>
            <StyledLoginLabel htmlFor='email'>Email</StyledLoginLabel>
            <StyledLoginInput
              id='email'
              name='email'
              type='email'
              enterKeyHint='next'
            />
            <StyledLoginError component='p' name='email' />

            <StyledLoginLabel htmlFor='password'>Password</StyledLoginLabel>
            <StyledLoginInput id='password' name='password' type='password' />
            <StyledLoginError component='p' name='password' />
            {/*TODO: Currently at #ffffff for testing, add theming support*/}
            <StyledLoginButton primary type='submit' disabled={isSubmitting}>
              {isSubmitting ? <BarLoader color='#ffffff' /> : 'Login'}
            </StyledLoginButton>
            <Link to={'/register'}>Not Registered?</Link>
          </Form>
        </StyledLogin>
      )}
    </Formik>
  )
}

export default Login
