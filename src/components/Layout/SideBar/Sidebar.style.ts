import { Button } from '@/components/Form'
import styled, { css } from 'styled-components'

export const StyledSidebar = styled.div`
  padding-top: calc(env(safe-area-inset-top));
  padding-bottom: calc(env(safe-area-inset-bottom));
  height: 100%;
  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  min-width: 5.5rem;
  min-height: 5.5rem;
  z-index: 0;
  background: var(--neko-sidebar-background);
  border: 0;

  a {
    text-decoration: none;
    color: var(--neko-text-inline);
  }

  &::-webkit-scrollbar {
    display: none;
  }

  img {
    border-radius: 16px;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 740px) {
    margin-bottom: 0;
    margin-right: 0.7rem;
  }
`

export const StyledSidebarScrollable = styled.div`
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 7.7rem;
  padding: 1rem 1rem;
  scrollbar-width: none;
`

export const StyledSidebarSeperator = styled.div`
  margin-bottom: 0.7rem;
  border-radius: 50%;
  min-height: 0.5rem;
  min-width: 0.5rem;
  height: 0.5rem;
  width: 0.5rem;
  background: var(--neko-sidebar-seperator);
  @media (max-width: 740px) {
    margin-bottom: 0;
    margin-right: 0.9rem;
  }
`

export const StyledSidebarButton = styled(Button)<{
  selected?: boolean
}>`
  margin: 0 0 0.7rem;
  padding: 0 !important;
  font-size: 0.7rem !important;
  background: transparent;
  width: 3.5rem;
  border-radius: 16px;
  height: 3.5rem;
  min-height: 3.5rem;
  min-width: 3.5rem;
  position: relative;
  background: var(--neko-channels-background);
  color: #ffffff;
  @media (max-width: 740px) {
    margin-bottom: 0;
    margin-right: 0.7rem;
  }

  ${({ selected }) =>
    selected &&
    css`
      box-shadow: 0 0 0 2px var(--neko-sidebar-background),
        0 0 0 4px var(--neko-text-primary);
    `}
`

const StyledSidebarButtonBadge = styled.div`
  position: absolute;
  height: 18px;
  border-radius: 50%;
  width: 18px;
  bottom: -3.45px;
  right: -3.45px;
  border-color: var(--neko-sidebar-background);
  border-width: 3.5px;
  border-style: solid;
  background: var(--neko-colors-primary);
`

export const StyledSidebarPinned = styled.div`
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  background-color: var(--neko-sidebar-background);
`

export const StyledSidebarPinnedWrapper = styled.div`
  position: absolute;
  bottom: 0;
  padding-bottom: 1rem;
  box-shadow: var(--neko-sidebar-shadow);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`

export const StyledSidebarIcon = styled.div<{
  selected?: boolean
}>`
  background-color: var(--neko-channels-background);
  background-size: cover;
  width: 3.5rem;
  height: 3.5rem;
  min-height: 3.5rem;
  min-width: 3.5rem;
  margin: 0 0 0.7rem;
  border-radius: 16px;
  transition: box-shadow 0.1s ease-in-out;
  animation: bounce 0.2s easing-in;
  position: relative;
  outline: none;

  img {
    border-radius: 16px;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 740px) {
    margin-bottom: 0;
    margin-right: 0.7rem;
  }

  ${({ selected }) =>
    selected &&
    css`
      box-shadow: 0 0 0 2px var(--neko-sidebar-background),
        0 0 0 4px var(--neko-text-primary);
    `}
`

export const StyledSidebarPlaceholder = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  min-height: 3.5rem;
  min-width: 3.5rem;
  margin: 0 0 0.7rem;
  border-radius: 16px;
  transition: box-shadow 0.1s ease-in-out;
  animation: bounce 0.2s ease-in;
  background: var(--neko-channels-background);
`
