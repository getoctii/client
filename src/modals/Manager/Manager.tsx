import { FC, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ModalTypes } from '@/utils/constants'
import { Alert } from '@/components/Overlay'
import { NewCommunity } from '@/modals/Community'
import { NewConversation, AddMember } from '@/domain/Conversation'
import {
  AddIntegration,
  NewGroup,
  NewChannel,
  NewInvite,
  ManageGroups,
  NewProduct,
  NewResource,
  NewVersion
} from '@/modals/Community'
import { File } from '@/domain/Chat/Embeds'
import { UI } from '@/state/ui'
import { Permission } from '@/utils/permissions'
import { AddFriend } from '@/modals/Hub'
import PreviewUser from '@/domain/User/PreviewUser'
import { Ringing } from '@/modals/Call'
import {
  StyledModal,
  StyledModalBackground,
  StyledModalContent
} from './Manager.style'

const ResolveModal = ({ name, props }: { name: ModalTypes; props?: any }) => {
  switch (name) {
    case ModalTypes.ADD_PARTICIPANT:
      return <AddMember {...props} />
    case ModalTypes.DELETE_MESSAGE:
      return <Alert {...props} />
    case ModalTypes.DEVELOPER_MODE:
      return <Alert {...props} />
    case ModalTypes.NEW_COMMUNITY:
      return <NewCommunity {...props} />
    case ModalTypes.NEW_CONVERSATION:
      return <NewConversation {...props} />
    case ModalTypes.NEW_PERMISSION:
      return <NewGroup {...props} />
    case ModalTypes.PREVIEW_IMAGE:
      return <File.Preview {...props} />
    case ModalTypes.NEW_CHANNEL:
      return <NewChannel {...props} />
    case ModalTypes.NEW_INVITE:
      return <NewInvite {...props} />
    case ModalTypes.NEW_PRODUCT:
      return <NewProduct {...props} />
    case ModalTypes.DELETE_CHANNEL:
      return <Alert {...props} />
    case ModalTypes.MANAGE_MEMBER_GROUPS:
      return <ManageGroups {...props} />
    case ModalTypes.ADD_FRIEND:
      return <AddFriend {...props} />
    case ModalTypes.NEW_RESOURCE:
      return <NewResource {...props} />
    case ModalTypes.NEW_VERSION:
      return <NewVersion {...props} />
    case ModalTypes.PREVIEW_USER:
      return <PreviewUser {...props} />
    case ModalTypes.RINGING:
      return <Ringing {...props} />
    case ModalTypes.ADD_INTEGRATION:
      return <AddIntegration {...props} />
    default:
      return <></>
  }
}

const Manager: FC = () => {
  const uiStore = UI.useContainer()
  useEffect(() => {
    // @ts-ignore
    window.setModal = uiStore.setModal
  }, [uiStore])
  if (!uiStore.modal) return <></>
  return (
    <Permission.Provider>
      <AnimatePresence exitBeforeEnter>
        {uiStore.modal.name !== ModalTypes.STATUS ? (
          <StyledModal>
            <StyledModalBackground
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}
              onClick={() =>
                uiStore.modal?.name !== ModalTypes.UPDATE &&
                uiStore.modal?.name !== ModalTypes.DECRYPT_KEYCHAIN &&
                uiStore.modal?.name !== ModalTypes.CODE_PROMPT &&
                uiStore.clearModal()
              }
            />
            <StyledModalContent
              drag={'y'}
              dragMomentum={false}
              dragConstraints={{
                top: 0,
                bottom: 0
              }}
              dragElastic={0}
              onDrag={(e, info) => {
                if (info.offset.y > 120) {
                  uiStore.modal?.name !== ModalTypes.UPDATE &&
                    uiStore.modal?.name !== ModalTypes.DECRYPT_KEYCHAIN &&
                    uiStore.modal?.name !== ModalTypes.CODE_PROMPT &&
                    uiStore.clearModal()
                }
              }}
              variants={{
                initialModel: {
                  scale: 0
                },
                initialPopover: {
                  top: '100vh'
                },
                animateModel: {
                  scale: 1
                },
                animatePopover: {
                  top: '0'
                }
              }}
              initial={'initialModel'}
              animate={'animateModel'}
              transition={{
                type: 'spring',
                duration: 0.25,
                bounce: 0.5
              }}
              exit={'initialModel'}
            >
              <ResolveModal {...uiStore.modal} />
            </StyledModalContent>
          </StyledModal>
        ) : (
          <></>
        )}
      </AnimatePresence>
    </Permission.Provider>
  )
}

export default Manager
