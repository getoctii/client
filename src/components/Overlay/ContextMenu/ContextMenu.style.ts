import { Theme } from '@/state/theme'
import styled, { css } from 'styled-components'

export const StyledContextMenu = styled.div<{
  theme?: Theme
}>`
  position: fixed;
  z-index: 100;
  margin-top: 0.5rem;
  margin-bottom: 0.7rem;
  background: ${({ theme }) => theme.context?.background};
  padding: 0.5rem;
  border-radius: 10px;
  backdrop-filter: blur(35px);
  -webkit-backdrop-filter: blur(35px);

  @-moz-document url-prefix() {
    // NOTE: Fireshit disables blur by default
    background: ${({ theme }) => theme.channels?.background};
  }
  cursor: pointer;
  div {
    padding: 0.5rem;
    border-radius: 5px;
    display: flex;
    align-items: center;
    span {
      margin-right: 0.8rem;
      font-size: 1rem;
      font-weight: 400;
    }

    &:hover {
      background: ${({ theme }) => theme.colors?.primary};
    }

    &:focus {
      outline: none;
    }

    svg {
      margin-left: auto;
    }
  }

  hr {
    margin: 5px 0.5rem 5px 0.5rem;
    opacity: 0.2;
    border: 1px ${({ theme }) => theme.context?.seperator} solid;
    border-radius: 2px;
    width: 100%;
    margin-left: 0 !important;
  }

  &:focus {
    outline: none;
  }
`

export const StyledContextMenuItem = styled.div<{
  theme?: Theme
  danger?: boolean
}>`
  ${({ danger }) =>
    danger &&
    css`
      color: ${({ theme }) => theme.text?.danger};
      &:hover {
        color: ${({ theme }) => theme.text?.inverse};
        background: ${({ theme }) => theme.colors?.danger};
      }
    `}
`

export const StyledContextMenuBackground = styled.div<{
  theme?: Theme
}>`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  @-moz-document url-prefix() {
    // NOTE: Fireshit disables blur by default
    background: ${({ theme }) => theme.channels?.background};
  }
`
