import { ComponentStory, ComponentMeta } from '@storybook/react'

import InputComponent from './Input'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Form/Input',
  component: InputComponent
} as ComponentMeta<typeof InputComponent>

export const Input: ComponentStory<typeof InputComponent> = () => (
  <InputComponent placeholder={'Placeholder text'} />
)
