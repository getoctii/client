import { FC } from 'react'
import styles from './NewConversation.module.scss'
import { Input, Button } from '@/components/Form'
import { Field, Form, Formik } from 'formik'
import { Auth } from '@/state/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle, faSearch } from '@fortawesome/pro-solid-svg-icons'
import queryClient from '../../utils/queryClient'
import { useHistory } from 'react-router-dom'
import {
  ConversationMember,
  ConversationType,
  createConversation,
  findUser,
  validate
} from '@/api/conversations'

const NewConversation: FC = () => {
  const { id, token } = Auth.useContainer()
  const history = useHistory()
  return (
    <div className={styles.newConversation}>
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
            const [username, discriminator] = values.tag.split('#')
            const user = await findUser(
              token,
              username,
              discriminator === 'inn' ? '0' : discriminator
            )
            const cache = queryClient.getQueriesData<ConversationMember[]>(
              'conversationMembers'
            )
            console.log(cache)
            const member = cache?.find((m) =>
              m[1].find((u) => u.userID === user.id)
            )
            if (!cache || !member) {
              const result = await createConversation(token!, {
                recipient: user.id,
                type: ConversationType.DM
              })
              if (result.id) history.push(`/conversations/${result.id}`)
              resetForm()
              setErrors({ tag: 'No input' })
            } else {
              history.push(`/conversations/${member[0]}`)
              resetForm()
              setErrors({ tag: 'No input' })
            }
          } catch (e: any) {
            if (
              e.response.data.errors.includes('UserNotFound') ||
              e.response.data.errors.includes('RecipientNotFound')
            )
              return setErrors({ tag: 'User not found' })
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, isValid, errors }) => (
          <Form>
            <Field
              placeholder={
                !isSubmitting ? 'Find or start a chat' : 'Finding...'
              }
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
    </div>
  )
}

export default NewConversation
