// Button.stories.ts|tsx

import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import Avatar from './Avatar'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Avatar',
  component: Avatar
} as ComponentMeta<typeof Avatar>

export const PlaceholderTemplate: ComponentStory<typeof Avatar> = (args) => (
  <Avatar
    username={args.username ?? 'adam'}
    size={args.size}
    avatar={args.avatar}
  />
)

export const Placeholder = PlaceholderTemplate.bind({})

Placeholder.parameters = {
  size: ['message', 'sidebar', 'conversation', 'friend', 'call']
}
