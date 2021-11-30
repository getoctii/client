import { Button } from '@/components/Form'
import { Theme } from '@/state/theme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled, { css } from 'styled-components'

export const StyledMessage = styled.div<{
  theme?: Theme
  primary?: boolean
}>`
  display: flex;
  padding-left: 2rem;
  padding-right: 2rem;

  h2 {
    font-size: 1rem;
    margin: 0;
    cursor: pointer;
  }

  p {
    line-height: 1.5rem;
    word-break: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    min-width: fit-content;
    max-width: 100%;
    display: inline-block;
    clear: both;
    margin: 0;
    font-size: 1rem;
    opacity: 0.8;
    font-weight: 300;

    @media (min-width: 741px) {
      user-select: text;
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ theme }) => theme.chat.hover};
    }
  }

  ${({ primary }) =>
    primary &&
    css`
      margin-top: 0.8rem;
    `}
`

export const StyledMessageAvatar = styled.div`
  min-width: 2.65rem;
  min-height: 2.65rem;
  width: 2.65rem;
  height: 2.65rem;
  object-fit: cover;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
`

export const StyledMessageContent = styled.div<{
  theme?: Theme
  spacer?: boolean
}>`
  margin-left: 1rem;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;

  a {
    color: ${({ theme }) => theme.text.primary};
    text-decoration: none;
  }

  ${({ spacer }) =>
    spacer &&
    css`
      margin-left: 3.65rem;
    `}
`

export const StyledMessageText = styled.div`
  margin: 0;
  padding: 0;
  line-height: 1.325rem;
  font-size: 1rem;
`

export const StyledMessageBadge = styled(FontAwesomeIcon)`
  margin-left: 0.5rem;
`

export const StyledMessageTime = styled.span`
  cursor: default;
  margin-left: 0.5rem;
  font-size: 0.7rem;
  font-weight: 300;
  opacity: 0.5;
`

export const StyledMessageInnerInput = styled.div`
  position: relative;

  svg {
    position: absolute;
    right: 0.8rem;
    bottom: 1.15rem;
    cursor: pointer;
  }

  #editMessage {
    margin-top: 0.4rem;
    margin-bottom: 0.4rem;
    padding: 0.8rem;
    border-radius: 11px;
    background: var(--neko-input-background);
    font-size: 1rem;
    font-weight: 300;
  }
`

export const StyledMessagePlaceholder = styled.div<{
  primary?: boolean
}>`
  display: flex;
  padding-left: 2rem;
  padding-right: 2rem;

  ${({ primary }) =>
    primary &&
    css`
      margin-top: 0.8rem;
    `}
`

export const StyledMessagePlaceholderAvatar = styled.div<{
  theme?: Theme
}>`
  width: 2.65rem;
  height: 2.65rem;
  min-width: 2.65rem;
  min-height: 2.65rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.channels.background};
`

export const StyledMessagePlaceholderContent = styled.div<{
  spacer?: boolean
}>`
  margin-left: 1rem;
  overflow: hidden;
  width: 100%;

  ${({ spacer }) =>
    spacer &&
    css`
      margin-left: 3.65rem;
    `}
`

export const StyledMessagePlaceholderContentMessage = styled.div<{
  theme?: Theme
}>`
  margin-top: 0.5rem;
  height: 1.15rem;
  width: 10rem;
  display: inline-block;
  clear: both;
  background-color: ${({ theme }) => theme.channels.background};
  border-radius: 6px;
`

export const StyledMessagePlaceholderContentUser = styled.div`
  display: flex;
`

export const StyledMessagePlaceholderContentUsername = styled.div<{
  theme?: Theme
}>`
  height: 1rem;
  margin: 0;
  width: 5rem;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.channels.background};
`

export const StyledMessagePlaceholderContentDate = styled.div<{
  theme?: Theme
}>`
  height: 1rem;
  margin-left: 0.25rem;
  width: 3rem;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.channels.background};
`

export const StyledMessageActions = styled.div<{
  theme?: Theme
}>`
  display: flex;
  margin-top: 0.25rem;
  button {
    background: ${({ theme }) => theme.colors.primary};

    &:not(:first-child) {
      margin-left: 0.25rem;
    }

    &:not(:last-child) {
      margin-right: 0.25rem;
    }
  }
`

export const StyledMessageSelectable = styled.p`
  -webkit-user-select: auto;
  -khtml-user-select: auto;
  -moz-user-select: auto;
  -o-user-select: auto;
  user-select: auto;
`

export const StyledMessageCode = styled.div`
  background-color: var(--neko-backgrounds-secondary);
  border-radius: 12px;
  padding: 1rem;
  font-weight: 300;
  font-size: 1rem;

  font-family: 'Ubuntu Mono';
`

export const StyledMessageLine = styled.span`
  display: flex;
  flex-direction: row;
`

export const StyledMessageLineIndicator = styled.p`
  color: var(--neko-text-primary);
`

export const StyledMessageLineContent = styled.p`
  color: var(--neko-text-secondary);
  -webkit-user-select: auto;
  -khtml-user-select: auto;
  -moz-user-select: auto;
  -o-user-select: auto;
  user-select: auto;
`

export const StyledMessageCopyButton = styled(Button)`
  background-color: var(--neko-backgrounds-primary);
  height: 1rem;
  width: 7rem;
  color: var(--neko-text-primary);
  margin-top: 1rem;
  margin-left: auto;
`
