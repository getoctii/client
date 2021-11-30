import { Theme } from '@/state/theme'
import styled, { css } from 'styled-components'

export const StyledConversationCard = styled.div<{
  theme?: Theme
  selected?: boolean
}>`
  display: flex;
  align-items: center;
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  border-radius: 16px;
  cursor: pointer;

  ${({ selected, theme }) =>
    selected &&
    css`
      box-shadow: ${theme.channels?.shadow};
      background: ${({ theme }) => theme.channels?.card};
      margin-left: -0.6rem;
      padding-left: 0.6rem;
      margin-right: -0.6rem;
      padding-right: 0.6rem;
    `}

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ theme }) => theme.sidebar?.background};
      margin-left: -0.6rem;
      padding-left: 0.6rem;
      margin-right: -0.6rem;
      padding-right: 0.6rem;
    }
  }
`

export const StyledConversationCardDetails = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`

export const StyledConversationCardUser = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  h4 {
    margin: 0 0 0 0.5rem;
    font-size: 1.05rem;
    font-weight: 600;
  }

  p {
    padding: 0;
    font-size: 0.75rem;
    margin: 0 0 0 0.5rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    .link {
      color: var(--neko-text-primary);
    }
  }
`

export const StyledConversationCardAvatar = styled.div`
  height: 3rem;
  width: 3rem;
  position: relative;

  svg {
    margin-left: 0.2rem;
  }

  img {
    border-radius: 14px;
    object-fit: cover;

    background-color: var(--neko-sidebar-background);
    height: 3rem;
    width: 3rem;
  }
`

export const StyledConversationCardAvatarGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  background: var(--neko-colors-primary);
  height: 3rem;
  width: 3rem;

  svg {
    margin-left: 0;
  }
`

export const StyledConversationCardPlaceholder = styled.div`
  display: flex;
  align-items: center;
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  border-radius: 16px;
`

export const StyledConversationCardPlaceholderAvatar = styled.div<{
  theme: Theme
}>`
  height: 3rem;
  width: 3rem;
  border-radius: 14px;
  position: relative;
  background: ${({ theme }) => theme.sidebar?.background};
`

export const StyledConversationCardPlaceholderUser = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

export const StyledConversationCardPlaceholderUsername = styled.div<{
  theme: Theme
}>`
  height: 1.05rem;
  margin: 0 0 0.25rem 0.5rem;
  width: 5rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.sidebar?.background};
`

export const StyledConversationCardPlaceholderStatus = styled.div<{
  theme: Theme
}>`
  padding: 0;
  height: 0.75rem;
  margin: 0 0 0 0.5rem;
  width: 8rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.sidebar?.background};
`

export const StyledConversationCardLink = styled.span<{ theme: Theme }>`
  color: ${({ theme }) => theme.text?.primary};
`
