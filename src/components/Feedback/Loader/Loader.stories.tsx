// Button.stories.ts|tsx

import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import LoaderComponent from './Loader'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Feedback/Loader',
  component: LoaderComponent
} as ComponentMeta<typeof LoaderComponent>

export const Loader: ComponentStory<typeof LoaderComponent> = (args) => (
  <LoaderComponent />
)
