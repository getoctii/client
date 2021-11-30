import { Theme } from '@/state/theme'
import styled, { css } from 'styled-components'
import { State } from '@/api/users'

export const StyledIconBadge = styled.div<{
  theme?: Theme
  state?: State
  selected?: boolean
}>`
  position: absolute;
  height: 16.45px;
  border-radius: 50%;
  width: 16.45px;
  bottom: -3.45px;
  right: -3.45px;
  border-color: ${({ theme }) => theme.channels.background};
  border-width: 3.45px;
  border-style: solid;

  ${({ state, theme }) => {
    switch (state) {
      case State.ONLINE:
        return css`
          background-color: ${theme.status.online};
        `
      case State.OFFLINE:
        return css`
          background-color: ${theme.status.offline};
        `
      case State.DND:
        return css`
          background-color: ${theme.status.dnd};
        `
      case State.IDLE:
        return css`
          background-color: ${theme.status.idle};
        `
    }
  }}

  ${({ theme, selected }) =>
    selected &&
    css`
      border-color: ${theme.status.selected};
    `}
`
