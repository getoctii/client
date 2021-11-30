import { Theme } from '@/state/theme'
import styled, { css } from 'styled-components'

export const StyledChannel = styled.div`
  position: relative;
  padding-bottom: 0;
  font-size: 1.3125rem;
  font-weight: 700;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`

export const StyledChannelHeader = styled.div<{
  theme?: Theme
}>`
  padding: 2rem;
  display: flex;
  z-index: 3;
  flex-direction: column;
  width: 100%;
  background-color: transparent;
  border-bottom: 1px;
  border-bottom-color: ${({ theme }) => theme?.chat?.seperator};
  border-bottom-style: solid;
`

export const StyledChannelHeading = styled.div<{
  theme?: Theme
}>`
  display: flex;
  flex-direction: row;

  button {
    background: ${({ theme }) => theme?.colors?.primary};
    color: ${({ theme }) => theme?.text?.inverse};
    padding: 0.5rem;
    width: 2.65rem;
    border-radius: 12px;
    margin-left: auto;
  }
`

export const StyledChannelHeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  font-size: 1.15rem;
  font-weight: 700;
  white-space: nowrap;
  overflow-y: hidden;
  text-overflow: ellipsis;
  p {
    margin: 0;
  }
`

export const StyledChannelHeaderStatus = styled.p`
  margin: 0.3rem 0 0;
  font-weight: 400;
  font-size: 0.9rem;
  width: 100%;
  white-space: nowrap;
  overflow-y: hidden;
  text-overflow: ellipsis;
`

export const StyledChannelHeaderIcon = styled.div<{
  theme?: Theme
}>`
  margin-right: 0.7rem;
  border-radius: 12px;
  color: ${({ theme }) => theme?.text?.inverse};
  cursor: pointer;
  svg {
    align-self: center;
  }
  display: flex;
  vertical-align: middle;
  justify-content: center;
`

export const StyledChannelTyping = styled.p`
  font-weight: 500;
  font-size: 0.8rem;
  padding: 0;
  height: 2rem;
  max-height: 2rem;
  min-height: 2rem;
  display: flex;
  align-items: center;
  margin: 0 2rem env(safe-area-inset-bottom);
`

export const StyledChannelTypingEmpty = styled.div`
  height: 2rem;
  max-height: 2rem;
  min-height: 2rem;
  margin: 0 0 env(safe-area-inset-bottom);
`

export const StyledChannelPlaceholder = styled.div`
  position: relative;
  padding-bottom: 0;
  font-size: 1.3125rem;
  font-weight: 700;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`

export const StyledChannelPlaceholderHeader = styled.div`
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  padding-left: 2rem;
  padding-right: 2rem;
  display: flex;
  min-height: 2.65rem;
  z-index: 5;
  flex-direction: row;
  align-items: center;

  @media (max-width: 740px) {
    margin-top: 0;
  }
`

export const StyledChannelPlaceholderHeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 2.65rem;
`

export const StyledChannelPlaceholderHeaderTitleName = styled.div<{
  theme?: Theme
}>`
  height: 1.5rem;
  width: 5rem;
  background: ${({ theme }) => theme.channels?.background};
  border-radius: 7px;
`

export const StyledChannelPlaceholderHeaderTitleStatus = styled.div<{
  theme?: Theme
}>`
  height: 1.15rem;
  width: 10rem;
  background: ${({ theme }) => theme.channels?.background};
  border-radius: 6px;
`

export const StyledChannelPlaceholderHeaderStatus = styled.div`
  margin: 0.3rem 0 0;
  font-weight: 400;
  font-size: 0.9rem;
`

export const StyledChannelPlaceholderHeaderIcon = styled.div<{ theme?: Theme }>`
  background: ${({ theme }) => theme.channels?.background};
  margin-right: 0.7rem;
  padding: 0.5rem;
  height: 2.65rem;
  width: 2.65rem;
  border-radius: 12px;
  display: flex;
  vertical-align: middle;
  justify-content: center;
`

export const StyledChannelPlaceholderMessages = styled.div`
  margin-top: auto;
  max-height: 100%;
  overflow-y: scroll;
`

export const StyledChannelHeaderButtonGroup = styled.div`
  display: flex;
  margin-left: auto;
  gap: 15px;
`

export const StyledChannelCall = styled.div`
  padding: 1.5rem;
`

export const StyledChannelCallContent = styled.div`
  display: flex;
  flex-direction: row;
`

export const StyledChannelCallVideoStreams = styled.div`
  margin-left: 1rem;
  margin-right: 1rem;
`

export const StyledChannelCallVideo = styled.video`
  width: 100%;
  max-width: 1000px;
`

export const StyledChannelCallVideoButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: auto;
  button {
    &:not(last-child) {
      margin-top: 0.5rem;
    }
    &:not(first-child) {
      margin-bottom: 0.5rem;
    }
  }
`

export const StyledChannelCallUsers = styled.div<{
  vertical?: boolean
}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;

  :not(:first-child) {
    margin-left: 0.5rem;
  }

  :not(:last-child) {
    margin-right: 0.5rem;
  }

  ${({ vertical }) =>
    vertical &&
    css`
      flex-direction: column;
      margin-right: 0;

      :not(:first-child) {
        margin-left: 0;
        margin-top: 0.5rem;
      }

      :not(:last-child) {
        margin-right: 0;
        margin-bottom: 0.5rem;
      }
    `}
`

export const StyledChannelCallButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 1rem;

  :not(:first-child) {
    margin-left: 0.25rem;
  }

  :not(:last-child) {
    margin-right: 0.25rem;
  }
`
