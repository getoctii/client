import { FC } from 'react'
import styles from './AddFriend.module.scss'
import { Modal } from '@/components/Overlay'
import { Input, Button } from '@/components/Form'
import { Field, Form, Formik } from 'formik'
import { clientGateway } from '@/utils/constants'
import { Auth } from '@/state/auth'
import { isTag } from '@/utils/validations'
import { findUser } from '@/api/conversations'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle, faSearch } from '@fortawesome/pro-solid-svg-icons'
import { UI } from '@/state/ui'
import { faTimesCircle } from '@fortawesome/pro-solid-svg-icons'
import axios from 'axios'

type formData = { tag: string }

const validate = (values: formData) => {
  const errors: { tag?: string } = {}
  if (!values.tag) errors.tag = 'No input'
  if (!isTag(values.tag)) errors.tag = 'A valid tag is required'
  return errors
}

const AddFriend: FC = () => {
  const ui = UI.useContainer()
  const { token, id } = Auth.useContainer()
  return (
    <Modal
      onDismiss={() => ui.clearModal()}
      title={'Add Friend'}
      icon={faTimesCircle}
    >
      <Formik
        initialValues={{ tag: '' }}
        initialErrors={{ tag: 'No input' }}
        validate={validate}
        onSubmit={async (
          values,
          { setSubmitting, setErrors, setFieldError, resetForm }
        ) => {
          if (!values?.tag) return setFieldError('tag', 'Required')
          try {
            if (!id || !token) return
            const [username, discriminator] = values.tag.split('#')
            const user = await findUser(
              token,
              username,
              discriminator === 'inn' ? '0' : discriminator
            )
            await clientGateway.put(
              `/users/me/relationships/${user.id}`,
              {
                type: 'OUTGOING'
              },
              {
                headers: { Authorization: token }
              }
            )
            setFieldError('tag', 'No input')
            resetForm()
          } catch (e) {
            if (axios.isAxiosError(e)) {
              switch (e.response?.data.error) {
                case 'UserNotFound':
                  setErrors({ tag: 'User not found' })
                  break
                case 'InvalidUser':
                  setErrors({ tag: 'Invalid user' })
                  break
              }
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, isValid, errors }) => (
          <Form className={styles.addFriend}>
            <Field
              placeholder={!isSubmitting ? 'Add a new friend' : 'Finding...'}
              component={Input}
              name='tag'
              autoComplete={'random'}
              type='text'
            />
            {errors.tag === 'User not found' ? (
              <Button type='button' className={styles.searchError} disabled>
                <FontAwesomeIcon icon={faExclamationCircle} />
              </Button>
            ) : !isValid ? (
              <Button
                type='button'
                className={styles.searchPlaceholder}
                disabled
              >
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            ) : (
              <Button
                type='submit'
                className={styles.search}
                disabled={isSubmitting}
              >
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            )}
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddFriend
