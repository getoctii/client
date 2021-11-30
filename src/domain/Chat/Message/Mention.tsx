import { FC } from 'react'
import { Auth } from '@/state/auth'
import { useUser } from '@/hooks/users'
import { useChannel } from '@/hooks/messages'
import { useNavigate } from 'react-location'
import { StyledMention } from './Mention.style'

const User: FC<{
  userID: string
  selected?: boolean
  attributes?: any
}> = ({ userID, selected, attributes, children }) => {
  const { id } = Auth.useContainer()
  const user = useUser(userID)
  return (
    <StyledMention selected={selected} isMe={userID === id} {...attributes}>
      @{user?.username}
      {children}
    </StyledMention>
  )
}

const Channel: FC<{
  channelID: string
  selected?: boolean
  attributes?: any
}> = ({ channelID, selected, attributes, children }) => {
  const navigate = useNavigate()
  const channel = useChannel(channelID)
  return (
    <StyledMention
      selected={selected}
      isMe
      {...attributes}
      onClick={() =>
        !attributes &&
        navigate({
          to: `/communities/${channel?.communityID}/channels/${channelID}`
        })
      }
    >
      #{channel?.name}
      {children}
    </StyledMention>
  )
}

const Mention = { User, Channel }

export default Mention
