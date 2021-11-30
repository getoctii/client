import { FC } from 'react'
import { Form, Formik } from 'formik'
import { register } from '@/api/auth'
import { BarLoader } from 'react-spinners'
import { Auth } from '@/state/auth'
import * as Yup from 'yup'
import axios from 'axios'
import {
  StyledRegister,
  StyledRegisterButton,
  StyledRegisterError,
  StyledRegisterHeading,
  StyledRegisterInput,
  StyledRegisterLabel
} from './Register.style'
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

const Register: FC = () => {
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
        <StyledRegister>
          <Form>
            <StyledRegisterHeading>Octii</StyledRegisterHeading>
            <p>The chat platform of the future</p>
            <StyledRegisterLabel htmlFor='email'>Email</StyledRegisterLabel>
            <StyledRegisterInput id='email' name='email' type='email' />
            <StyledRegisterError component='p' name='email' />

            <StyledRegisterLabel htmlFor='username'>
              Username
            </StyledRegisterLabel>
            <StyledRegisterInput id='username' name='username' type='text' />
            <StyledRegisterError component='p' name='username' />

            <StyledRegisterLabel htmlFor='password'>
              Password
            </StyledRegisterLabel>
            <StyledRegisterInput
              id='password'
              name='password'
              type='password'
            />
            <StyledRegisterError component='p' name='password' />

            <StyledRegisterButton primary type='submit' disabled={isSubmitting}>
              {isSubmitting ? <BarLoader color='#ffffff' /> : 'Register'}
            </StyledRegisterButton>
            <Link to={'/login'}>Already Registered?</Link>
          </Form>
        </StyledRegister>
      )}
    </Formik>
  )
}

export default Register
