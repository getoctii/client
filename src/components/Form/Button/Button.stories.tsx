// Button.stories.ts|tsx

import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import Button from './Button'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Form/Button',
  component: Button
} as ComponentMeta<typeof Button>

export const Primary: ComponentStory<typeof Button> = () => (
  <Button primary>Button</Button>
)

export const Secondary: ComponentStory<typeof Button> = () => (
  <Button secondary>Button</Button>
)

export const Light: ComponentStory<typeof Button> = () => (
  <Button light>Button</Button>
)

export const Dark: ComponentStory<typeof Button> = () => (
  <Button dark>Button</Button>
)

export const Warning: ComponentStory<typeof Button> = () => (
  <Button warning>Button</Button>
)

export const Danger: ComponentStory<typeof Button> = () => (
  <Button danger>Button</Button>
)

export const Info: ComponentStory<typeof Button> = () => (
  <Button info>Button</Button>
)

export const Success: ComponentStory<typeof Button> = () => (
  <Button success>Button</Button>
)

export const Pill: ComponentStory<typeof Button> = () => (
  <Button primary pill>
    Button
  </Button>
)
