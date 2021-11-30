import { FC, memo, Suspense, useCallback, useMemo } from 'react'
import { Button } from '@/components/Form'
import dayjs from 'dayjs'
import dayjsUTC from 'dayjs/plugin/utc'
import dayjsCalendar from 'dayjs/plugin/calendar'
import {
  faCopy,
  faTrashAlt,
  IconDefinition,
  faPencilAlt
} from '@fortawesome/pro-solid-svg-icons'
import { Auth } from '@/state/auth'
import { useQuery } from 'react-query'
import { ModalTypes } from '@/utils/constants'
import { ContextMenu } from '@/components/Overlay'
import useMarkdown from '@innatical/markdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faUserShield } from '@fortawesome/pro-solid-svg-icons'
import { ErrorBoundary } from 'react-error-boundary'
import { UI } from '@/state/ui'
import { patchEncryptedMessage, patchMessage } from '@/api/messages'
import { Editor } from '@/components/Form'
import { Chat } from '@/state/chat'
import { withHistory } from 'slate-history'
import { withReact } from 'slate-react'
import { withMentions } from '@/utils/slate'
import { createEditor } from 'slate'
import { Invite, File } from '@/domain/Chat/Embeds'
import Mention from './Mention'
import { useCurrentUser, useUser } from '@/hooks/users'
import { Keychain } from '@/state/keychain'
import { getProduct, getResource } from '@/api/communities'
import Avatar from '@/components/Avatar/Avatar'
import { EncryptedMessage } from '@innatical/inncryption'
import { useDecryptMessage } from '@/hooks/messages'
import {
  StyledMessage,
  StyledMessageActions,
  StyledMessageBadge,
  StyledMessageCode,
  StyledMessageContent,
  StyledMessageCopyButton,
  StyledMessageInnerInput,
  StyledMessageLine,
  StyledMessageLineContent,
  StyledMessageLineIndicator,
  StyledMessagePlaceholder,
  StyledMessagePlaceholderAvatar,
  StyledMessagePlaceholderContent,
  StyledMessagePlaceholderContentDate,
  StyledMessagePlaceholderContentMessage,
  StyledMessagePlaceholderContentUser,
  StyledMessageSelectable,
  StyledMessageTime
} from './Message.style'
import { UserBadges } from '@/api/users'

dayjs.extend(dayjsUTC)
dayjs.extend(dayjsCalendar)

const stringToLineArray = (str: string) => {
  return str.split(/\n*\n/)
}

type Embed = {
  embed: React.ReactNode
  link: React.ReactNode
}

const isEmbed = (element: any): element is Embed => {
  return typeof element === 'object' && element['embed'] && element['link']
}

const EditBox: FC<{
  id: string
  content: string
  onDismiss: () => void
  encrypted: boolean
}> = ({ id, content, onDismiss, encrypted }) => {
  const user = useCurrentUser()
  const { token } = Auth.useContainer()
  const editor = useMemo(
    () => withHistory(withReact(withMentions(createEditor()))),
    []
  )
  const { keychain } = Keychain.useContainer()
  return (
    <StyledMessageInnerInput>
      <Editor
        id={'editMessage'}
        editor={editor}
        userMentions={false}
        newLines
        onDismiss={onDismiss}
        emptyEditor={[
          {
            children: [{ text: content }]
          }
        ]}
        onEnter={async (content) => {
          if (!token || !content) return
          onDismiss()
          if (encrypted) {
            await patchEncryptedMessage(
              id,
              content,
              token,
              keychain!,
              user?.keychain.publicKeychain.encryption!
            )
          } else {
            await patchMessage(id, content, token)
          }
        }}
      />

      <FontAwesomeIcon icon={faTimesCircle} onClick={() => onDismiss()} />
    </StyledMessageInnerInput>
  )
}

const MessageView: FC<{
  id: string
  authorID: string
  createdAt: string
  updatedAt: string
  payload: { content: string } | EncryptedMessage
  primary: boolean
  conversationID?: string
  richContent?: {
    username?: string
    avatar?: string
    resource_id?: string
    product_id?: string
    actions?: {
      type: 'button'
      content: string
      action: number
    }[]
  }
}> = memo(
  ({
    id,
    authorID,
    createdAt,
    updatedAt,
    primary,
    payload,
    richContent,
    conversationID
  }) => {
    const auth = Auth.useContainer()
    const user = useUser(authorID)
    const {} = Chat.useContainer()

    ///////// well, that would make sense
    // so
    // basically, if the user === currentUser, it will use the sessionkey derived from the user's public key
    // which would be the current user
    // we need to ALWAYS use the other user's public key
    // HM
    // what we could do is get the publickey from the state
    // const { data: sessionKey } = useQuery(
    //   ['sessionKey', user],
    //   async () => {
    //     if (!!user!.keychain.publicKeychain.encryption)
    //       return await keychain?.encryption.sessionKey(
    //         user!.keychain.publicKeychain.encryption
    //       )
    //     else return undefined
    //   },
    //   {
    //     enabled: typeof content !== 'string' && !!user
    //   }
    // )

    const { data: product } = useQuery(
      ['products', richContent?.product_id, auth.token],
      async () => getProduct('', richContent?.product_id!, auth.token!),
      {
        enabled: !!richContent?.product_id
      }
    )

    const { data: resource } = useQuery(
      [
        'resource',
        richContent?.product_id,
        richContent?.resource_id,
        auth.token
      ],
      async () =>
        getResource(
          '',
          richContent?.product_id!,
          richContent?.resource_id!,
          auth.token!
        ),
      {
        enabled: !!richContent?.resource_id
      }
    )

    const messageContent = useDecryptMessage({
      id,
      authorID,
      payload,
      conversationID
    })
    const uiStore = UI.useContainer()
    const { editingMessageID, setEditingMessageID } = Chat.useContainerSelector(
      ({ editingMessageID, setEditingMessageID }) => ({
        editingMessageID,
        setEditingMessageID
      })
    )
    const ui = UI.useContainerSelector(({ setModal }) => ({
      setModal
    }))
    // const { hasPermissions } = Permission.useContainer()
    // const [deleteMessage] = useMutation(
    //   async () =>
    //     (
    //       await clientGateway.delete(`/messages/${id}`, {
    //         headers: { Authorization: auth.token }
    //       })
    //     ).data
    // )
    const getItems = useCallback(() => {
      const items: {
        text: string
        icon: IconDefinition
        danger: boolean
        onClick: any
      }[] = [
        {
          text: 'Copy Message',
          icon: faCopy,
          danger: false,
          onClick: async () => {
            await navigator.clipboard.writeText(messageContent!)
          }
        },
        {
          text: 'Copy ID',
          icon: faCopy,
          danger: false,
          onClick: async () => {
            await navigator.clipboard.writeText(id!)
          }
        }
      ]

      if (authorID === auth.id) {
        items.push({
          text: 'Edit Message',
          icon: faPencilAlt,
          danger: false,
          onClick: () => setEditingMessageID(id)
        })
      }
      if (true || authorID === auth.id) {
        items.push({
          text: 'Delete Message',
          icon: faTrashAlt,
          danger: true,
          onClick: () =>
            uiStore.setModal({
              name: ModalTypes.DELETE_MESSAGE,
              props: {
                type: 'message',
                onConfirm: async () => {
                  // await deleteMessage()
                  uiStore.clearModal()
                },
                onDismiss: () => uiStore.clearModal()
              }
            })
        })
      }
      return items
    }, [
      authorID,
      // deleteMessage,
      id,
      uiStore,
      auth.id,
      setEditingMessageID,
      // hasPermissions,
      messageContent
    ])
    const output = useMarkdown(messageContent!, {
      bold: (str, key) => <strong key={key}>{str}</strong>,
      italic: (str, key) => <i key={key}>{str}</i>,
      underlined: (str, key) => <u key={key}>{str}</u>,
      strikethough: (str, key) => <del key={key}>{str}</del>,
      link: (str, key) => {
        const link = (
          <a
            href={str}
            key={`${key}-href`}
            target='_blank'
            rel='noopener noreferrer'
          >
            {str}
          </a>
        )
        if (Invite.isInvite(str)) {
          return {
            link: <></>,
            embed: (
              <span key={key}>
                <ErrorBoundary fallbackRender={() => <Invite.ErrorEmbed />}>
                  <Suspense fallback={<Invite.Placeholder />}>
                    <Invite.Embed url={str} />
                  </Suspense>
                </ErrorBoundary>
              </span>
            )
          }
        } else if (File.isFile(str)) {
          return {
            link: <></>,
            embed: (
              <ErrorBoundary fallbackRender={() => <p>{link}</p>}>
                <File.Embed key={key} url={str} />
              </ErrorBoundary>
            )
          }
        } else {
          return link
        }
      },
      codeblock: (str, key) => ({
        link: <></>,
        embed: str ? (
          <StyledMessageCode key={key}>
            {stringToLineArray(str.trim()).map((e: string, i: number) =>
              i < 999 ? (
                <StyledMessageLine>
                  <StyledMessageLineIndicator>
                    {i + 1}{' '}
                    {' '.repeat(3 - (i + 1).toString().split('').length)}
                  </StyledMessageLineIndicator>
                  <StyledMessageLineContent>{e}</StyledMessageLineContent>
                </StyledMessageLine>
              ) : (
                <></>
              )
            )}
            <StyledMessageCopyButton
              type='button'
              onClick={async () => {
                await navigator.clipboard.writeText(str)
              }}
            >
              Copy Code
            </StyledMessageCopyButton>
          </StyledMessageCode>
        ) : (
          <></>
        )
      }),
      custom: [
        [
          /<@([A-Za-z0-9-]+?)>/g,
          (str, key) => (
            <span key={key}>
              <ErrorBoundary fallbackRender={() => <span>&lt;@{str}&gt;</span>}>
                <Suspense fallback={<span>@unknown</span>}>
                  <Mention.User userID={str} selected={false} />
                </Suspense>
              </ErrorBoundary>
            </span>
          )
        ],
        [
          /<#([A-Za-z0-9-]+?)>/g,
          (str, key) => (
            <span key={key}>
              <ErrorBoundary fallbackRender={() => <span>&lt;@{str}&gt;</span>}>
                <Suspense fallback={<span>#unknown</span>}>
                  <Mention.Channel channelID={str} selected={false} />
                </Suspense>
              </ErrorBoundary>
            </span>
          )
        ]
      ]
    })
    const main = useMemo(
      () =>
        output.map((element) => (isEmbed(element) ? element.link : element)),
      [output]
    )
    const embeds = useMemo(
      () => output.filter(isEmbed).map((element) => element.embed),
      [output]
    )
    return (
      <ContextMenu.Wrapper
        title={`${
          resource?.name || richContent?.username || user?.username || 'Unknown'
        }'s Message`}
        message={messageContent}
        key={id}
        items={getItems()}
      >
        <StyledMessage primary={!!primary}>
          {primary && (
            <Avatar
              username={user?.username ?? ''}
              avatar={user?.avatar}
              size='message'
            />
          )}
          <StyledMessageContent spacer={!primary}>
            {primary && (
              <h2 key='username'>
                <span>
                  {resource?.name || richContent?.username || user?.username}
                  {user?.badges.includes(UserBadges.STAFF) && (
                    <StyledMessageBadge icon={faUserShield} />
                  )}
                </span>
                <StyledMessageTime>
                  {dayjs.utc(createdAt).local().calendar()}
                </StyledMessageTime>
              </h2>
            )}
            {editingMessageID === id ? (
              <EditBox
                id={id}
                content={messageContent!}
                onDismiss={() => setEditingMessageID(undefined)}
                encrypted={typeof payload === 'object' ? true : false}
              />
            ) : (
              <StyledMessageSelectable key={id}>{main}</StyledMessageSelectable>
            )}
            {embeds.length > 0 ? embeds : <></>}
            {richContent?.actions?.length ?? 0 > 0 ? (
              <StyledMessageActions>
                {richContent?.actions?.map(({ content }) => (
                  <Button type='button'>{content}</Button>
                ))}
              </StyledMessageActions>
            ) : (
              <></>
            )}
          </StyledMessageContent>
        </StyledMessage>
      </ContextMenu.Wrapper>
    )
  }
)

const MessagePlaceholder: FC = () => {
  const username = useMemo(() => Math.floor(Math.random() * 6) + 3, [])
  const message = useMemo(() => Math.floor(Math.random() * 10) + 8, [])
  const isPrimary = useMemo(() => Math.floor(Math.random() * 1000000) + 1, [])
  return (
    <StyledMessagePlaceholder primary={isPrimary % 2 === 0}>
      {isPrimary % 2 === 0 && <StyledMessagePlaceholderAvatar />}
      <StyledMessagePlaceholderContent spacer={isPrimary % 2 !== 0}>
        <StyledMessagePlaceholderContentUser>
          {isPrimary % 2 === 0 && (
            <StyledMessagePlaceholderContentMessage
              style={{ width: `${username}rem` }}
            />
          )}
          {isPrimary % 2 === 0 && <StyledMessagePlaceholderContentDate />}
        </StyledMessagePlaceholderContentUser>
        <StyledMessagePlaceholderContentMessage
          style={{ width: `${message}rem` }}
        />
      </StyledMessagePlaceholderContent>
    </StyledMessagePlaceholder>
  )
}

const Message = { View: MessageView, Placeholder: MessagePlaceholder, Mention }

export default Message
