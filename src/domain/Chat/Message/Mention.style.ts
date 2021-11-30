import { Theme } from '@/state/theme'
import styled, { css } from 'styled-components'

export const StyledMention = styled.span<{
  selected?: boolean
  isMe?: boolean
  theme?: Theme
}>`
  font-weight: 600;
  color: ${({ theme }) => theme.mention.other};
  cursor: pointer;

  ${({ isMe }) =>
    isMe &&
    css`
      color: ${({ theme }) => theme.mention.me};
      border-radius: 4px;
    `}

  ${({ selected }) =>
    selected &&
    css`
      color: ${({ theme }) => theme.text.inverrse};
      font-weight: 700;
    `}
`
