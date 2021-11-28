import { Theme } from '@/state/theme'
import styled, { css } from 'styled-components'

export const StyledLoader = styled.div<{
  theme: Theme
}>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => css`
    background: ${theme.backgrounds?.primary ??
    'var(--neko-backgrounds-primary)'};
    span {
      span {
        background: ${theme.colors?.primary ?? 'var(--neko-colors-primary)'};
      }
    }
  `}
`
