import styled, { css } from 'styled-components'

export const StyledStatusBar = styled.div<{
  sidebar?: boolean
}>`
  height: 100%;
  width: 100%;

  @media (max-width: 740px) {
    padding-top: env(safe-area-inset-top);
  }

  ${({ sidebar }) =>
    sidebar &&
    css`
      width: auto;
      @media (max-width: 740px) {
        height: calc(100% - (5.5rem + env(safe-area-inset-bottom)));
      }
    `}
`
