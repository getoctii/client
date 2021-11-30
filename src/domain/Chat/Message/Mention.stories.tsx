import { ComponentStory, ComponentMeta } from '@storybook/react'

import { StyledMention } from './Mention.style'

export default {
  title: 'Chat/Message/Mention',
  component: StyledMention
} as ComponentMeta<typeof StyledMention>

const MentionTemplate: ComponentStory<typeof StyledMention> = (args) => (
  <StyledMention selected={args.selected} isMe={args.isMe}>
    {args.username}
  </StyledMention>
)

export const Mention = MentionTemplate.bind({})

Mention.args = {
  selected: false,
  isMe: false,
  username: '@adam'
}
