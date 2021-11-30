import styles from './Box.module.scss'
import { Button } from '@/components/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileUpload,
  faSmileWink,
  faTimes
} from '@fortawesome/pro-solid-svg-icons'
import { FC, Suspense, useMemo, useRef, useState } from 'react'
import { useMedia } from 'react-use'
import Picker from 'emoji-picker-react'
import { Auth } from '@/state/auth'
import { postTyping, uploadFile } from '@/api/messages'
import { Chat } from '@/state/chat'
import Upload from './Upload'
import { emptyEditor, withMentions } from '@/utils/slate'
import { Editor } from '@/components/Form'
import { createEditor, Editor as SlateEditor, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import { withReact } from 'slate-react'
import { SymmetricKey } from '@innatical/inncryption'
import {
  StyledBox,
  StyledBoxButtons,
  StyledBoxInput,
  StyledBoxMentions,
  StyledBoxMissingPermissions,
  StyledBoxPicker,
  StyledBoxPlaceholder,
  StyledBoxPlaceholderButton,
  StyledBoxPlaceholderInput,
  StyledBoxUploadInput
} from './Box.style'

const adjectives = [
  ' amazing',
  ' insightful',
  ' funny',
  ' about cats',
  ' interesting',
  ' special',
  ' innovative',
  ', anything really',
  ' delightful',
  ' steamy',
  ' about Innatical'
]

const BoxView: FC<{
  channelID: string
  hasPermission: boolean
  sessionKey?: SymmetricKey
}> = ({ channelID, hasPermission, sessionKey }) => {
  const { sendMessage, uploadDetails, setUploadDetails } =
    Chat.useContainerSelector(
      ({ sendMessage, uploadDetails, setUploadDetails }) => ({
        sendMessage,
        uploadDetails,
        setUploadDetails
      })
    )
  const { token } = Auth.useContainer()
  const isMobile = useMedia('(max-width: 740px)')
  const adjective = useMemo(
    () => adjectives[Math.floor(Math.random() * adjectives.length)],
    []
  )
  const uploadInput = useRef<HTMLInputElement>(null)
  const [emojiPicker, setEmojiPicker] = useState(false)
  const editor = useMemo(
    () => withHistory(withReact(withMentions(createEditor()))),
    []
  )
  return (
    <>
      <Suspense fallback={<BoxPlaceholder />}>
        {uploadDetails && !emojiPicker && (
          <StyledBoxPicker>
            <Upload
              {...uploadDetails}
              onUpload={async (file) => {
                setUploadDetails({
                  status: 'uploading',
                  file
                })
                if (!token) return
                const url = await uploadFile(file, token)
                await sendMessage(url, sessionKey)
                setUploadDetails(null)
              }}
            />
          </StyledBoxPicker>
        )}

        {emojiPicker && (
          <StyledBoxPicker>
            <Picker
              onEmojiClick={(_, data) => {
                if (editor.selection) {
                  editor.insertText(data.emoji)
                } else {
                  Transforms.insertText(editor, data.emoji, {
                    at: SlateEditor.end(editor, [])
                  })
                }
              }}
              native
            />
          </StyledBoxPicker>
        )}

        {hasPermission ? (
          <Editor
            draftKey={channelID}
            id={'sendMessage'}
            editor={editor}
            wrapper={StyledBox}
            mentions={StyledBoxMentions}
            input={StyledBoxInput}
            emptyEditor={emptyEditor}
            newLines
            placeholder={`Say something${adjective}...`}
            userMentions
            onTyping={async () => {
              if (!token) return
              await postTyping(channelID, token)
            }}
            onEnter={async (content) => {
              if (content !== '' || uploadDetails) {
                if (uploadDetails && token) {
                  setUploadDetails({
                    status: 'uploading',
                    file: uploadDetails.file
                  })
                  const file = await uploadFile(uploadDetails.file, token)
                  if (content !== '') {
                    await sendMessage(`${content}\n${file}`, sessionKey)
                  } else {
                    await sendMessage(file, sessionKey)
                  }
                  setUploadDetails(null)
                } else {
                  await sendMessage(content, sessionKey)
                }
              }
            }}
          >
            <StyledBoxButtons>
              {!isMobile && (
                <Button
                  type='button'
                  onClick={() => setEmojiPicker(!emojiPicker)}
                >
                  <FontAwesomeIcon icon={faSmileWink} />
                </Button>
              )}

              <Button
                type='button'
                onClick={() => {
                  if (!!uploadDetails && emojiPicker) setEmojiPicker(false)
                  else if (!!uploadDetails) {
                    if (uploadInput.current) uploadInput.current.value = ''
                    setUploadDetails(null)
                  } else {
                    uploadInput.current?.click()
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={uploadDetails && !emojiPicker ? faTimes : faFileUpload}
                />
                <StyledBoxUploadInput
                  ref={uploadInput}
                  type='file'
                  onChange={async (event) => {
                    if (!token || !event.target.files?.item(0)) return
                    setUploadDetails({
                      status: 'pending',
                      file: event.target.files.item(0) as File
                    })
                  }}
                />
                {uploadDetails && emojiPicker && (
                  <div className={`${styles.badge}`} />
                )}
              </Button>
            </StyledBoxButtons>
          </Editor>
        ) : (
          <StyledBoxMissingPermissions>
            Sending Messages is disabled for this channel!
          </StyledBoxMissingPermissions>
        )}
      </Suspense>
    </>
  )
}

const BoxPlaceholder: FC = () => {
  return (
    <StyledBoxPlaceholder>
      <StyledBoxPlaceholderInput />
      <StyledBoxPlaceholderButton />
      <StyledBoxPlaceholderButton />
    </StyledBoxPlaceholder>
  )
}

const Box = { View: BoxView, Placeholder: BoxPlaceholder }

export default Box
