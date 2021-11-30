import { Theme } from '@/state/theme'
import styled, { css } from 'styled-components'

export const StyledListCard = styled.div<{
  theme?: Theme
}>`
  overflow: hidden;
  width: 100%;
  background-color: ${({ theme }) => theme.settings?.card};
  padding: 1rem;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;

  h4 {
    margin: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  time {
    font-size: 0.8rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  &:first-child {
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
  }

  &:last-of-type {
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;
  }

  button {
    background: var(--neko-colors-secondary);
    margin-left: auto;
    height: 45px;
    width: 45px;
  }
`
