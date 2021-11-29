import { Theme } from '@/state/theme'
import styled, { css } from 'styled-components'

export const StyledHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  small {
    padding: 0;
    margin: 0;
  }
  h2 {
    padding: 0;
    margin: 0;
    font-size: 1.2rem;
  }
`

export const StyledHeaderIcon = styled.div<{
  clickable?: boolean
  secondary?: boolean
  primary?: boolean
  theme?: Theme
}>`
  background-size: cover;
  background-repeat: no-repeat;
  margin-right: 0.7rem;
  padding: 0.5rem;
  height: 2.65rem;
  width: 2.65rem;
  border-radius: 12px;
  font-size: 1.25rem;

  ${({ theme }) =>
    css`
      color: ${theme.text.inverse};
    `}
  svg {
    align-self: center;

    font-size: 1.25rem;
  }
  display: flex;
  vertical-align: middle;
  justify-content: center;

  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
    `}
  ${({ primary, theme }) =>
    primary &&
    css`
      background-color: ${theme.colors.primary};
    `}
    ${({ secondary, theme }) =>
    secondary &&
    css`
      background-color: ${theme.colors.secondary};
    `}
`

export const StyledHeaderPlaceholderWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`

export const StyledHeaderPlaceholderIcon = styled.div<{
  theme: Theme
}>`
  margin-right: 0.8rem;
  height: 2.65rem;
  width: 2.65rem;
  min-height: 2.65rem;
  min-width: 2.65rem;
  background-color: ${({ theme }) => theme.settings?.card};
  background-size: contain;
  border-radius: 12px;
`

export const StyledHeaderPlaceholderTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 2.65rem !important;
`

export const StyledHeaderPlaceholderTitleCommunity = styled.div<{
  theme: Theme
}>`
  border-radius: 5px;
  background-color: ${({ theme }) => theme.settings?.card};
  height: 0.9rem;
  width: 3rem;
`

export const StyledHeaderPlaceholderTitleSubtitle = styled.div<{
  theme: Theme
}>`
  border-radius: 5px;
  background-color: ${({ theme }) => theme.settings?.card};
  height: 1.3125rem;
  width: 5rem;
`
