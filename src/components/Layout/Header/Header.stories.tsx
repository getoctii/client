// Button.stories.ts|tsx

import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import HeaderComponent, { Placeholder as PlaceholderComponent } from './Header'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Layout/Header',
  component: HeaderComponent
} as ComponentMeta<typeof HeaderComponent>

export const Header: ComponentStory<typeof HeaderComponent> = (args) => (
  <HeaderComponent {...args} />
)

export const Placeholder: ComponentStory<typeof HeaderComponent> = (args) => (
  <PlaceholderComponent />
)
