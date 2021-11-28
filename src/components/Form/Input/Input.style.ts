import { Theme } from '@/state/theme'
import styled, { css } from 'styled-components'

export const StyledInput = styled.input<{
  theme: Theme
}>`
  font-family: Inter, sans-serif;
  border: 0;
  border-radius: 11px;

  outline: none;

  margin: 0;
  padding: 0.9rem 1.2rem;

  transition: ease-in-out box-shadow 0.15s;

  font-weight: 500;
  font-size: 1rem;

  ${({ theme }) => css`
    background: ${theme.input?.background};
    color: ${theme.text?.normal};
    &::placeholder {
      font-family: Inter, sans-serif;
      opacity: 1;
      color: ${theme.text};
    }
  `}
`
