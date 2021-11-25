import {
  faCirclePlus,
  faExclamationCircle
} from '@fortawesome/pro-solid-svg-icons'
import { faSearch } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Field, Form, Formik } from 'formik'
import { FC, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Auth } from '@/state/auth'
import { Input, Button } from '@/components/Form'
import {
  addConversationMember,
  ConversationType,
  createConversation,
  findUser,
  validate
} from '@/api/conversations'
import { UI } from '@/state/ui'
import { clientGateway } from '@/utils/constants'
import styles from './AddMember.module.scss'
import { useRelationships, useUser } from '@/hooks/users'
import {
  AddMemberWrapper,
  FriendCard,
  FriendDetails,
  Friends
} from './AddMember.style'
import Avatar from '@/components/Avatar/Avatar'
import { useNavigate } from 'react-location'

const Friend: FC<{
  id: string
  onClick?: () => void
}> = ({ id, onClick }) => {
  const user = useUser(id)
  return (
    <FriendCard>
      <Avatar username={user?.username} avatar={user?.avatar} />
      <FriendDetails>
        <h1>{user?.username}</h1>
        <FontAwesomeIcon
          icon={faCirclePlus}
          onClick={() => onClick && onClick()}
        />
      </FriendDetails>
    </FriendCard>
  )
}

const AddMember: FC<{
  groupID?: string
  participant?: string
}> = ({ groupID, participant }) => {
  const uiStore = UI.useContainer()
  const navigate = useNavigate()
  const { token } = Auth.useContainer()
  const relationships = useRelationships()
  if (relationships) relationships.friends.length = 3
  return (relationships?.friends ?? []).length > 0 ? (
    <AddMemberWrapper>
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
            const splitted = values.tag.split('#')
            const searchedUser = await findUser(
              token,
              splitted[0],
              splitted[1] === 'inn' ? '0' : splitted[1]
            )
            if (!groupID) {
              const result = await createConversation(token!, {
                recipients: [participant!, searchedUser.id],
                type: ConversationType.GROUP
              })
              if (result.id) {
                navigate({ to: `/app/conversations/${result.id}` })
                await clientGateway.post(
                  `/conversations/${result.id}`,
                  {
                    recipient: searchedUser.id
                  },
                  { headers: { Authorization: token } }
                )
              }
              resetForm()
              setErrors({ tag: 'No input' })
            } else if (groupID) {
              await clientGateway.post(
                `/conversations/${groupID}`,
                {
                  recipient: searchedUser.id
                },
                { headers: { Authorization: token } }
              )
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
            uiStore.clearModal()
          }
        }}
      >
        {({ isSubmitting, isValid, errors }) => (
          <Form>
            <Field
              placeholder={
                !isSubmitting
                  ? !groupID
                    ? 'Start a new group chat'
                    : 'Add a user'
                  : 'Finding...'
              }
              component={Input}
              name='tag'
              autoComplete={'random'}
              type='text'
            />
            {errors.tag === 'User not found' ? (
              <button type='button' disabled>
                <FontAwesomeIcon icon={faExclamationCircle} />
              </button>
            ) : !isValid ? (
              <button type='button' disabled>
                <FontAwesomeIcon icon={faSearch} />
              </button>
            ) : (
              <button type='submit' disabled={isSubmitting}>
                <FontAwesomeIcon icon={faSearch} />
              </button>
            )}
          </Form>
        )}
      </Formik>
      <Friends>
        {relationships?.friends.map((friend) => (
          <Friend
            id={friend}
            onClick={async () => {
              if (!groupID) {
                const result = await createConversation(token!, {
                  recipients: [participant!, friend],
                  type: ConversationType.GROUP
                })
                navigate({ to: `/app/conversations/${result.id}` })
              } else {
                await addConversationMember(groupID, friend, token!)
              }
            }}
          />
        ))}
      </Friends>
    </AddMemberWrapper>
  ) : (
    <div className={styles.noFriends}>
      <h2>You have no friends!</h2>
      <Button type={'button'} onClick={() => navigate({ to: `/app/hub` })}>
        Go add some!
      </Button>
    </div>
  )
}

export default AddMember
