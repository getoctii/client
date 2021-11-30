import styled, { css } from 'styled-components'

export const StyledChannelListSpacer = styled.div`
  height: 10px;
`

export const StyledChannelList = styled.div`
  hr {
    margin: 0 0 0 2.6rem;
    border-color: var(--neko-channels-seperator);
    opacity: 0.5;
    border-style: solid;
  }
`

export const StyledChannelListPlaceholder = styled.div`
  hr {
    margin: 0 0 0 2.6rem;
    border-color: var(--neko-sidebar-seperator);
    opacity: 0.5;
    border-style: solid;
  }
`

export const StyledChannelListPlaceholderRooms = styled.div`
  margin-top: 0.5rem;
  height: 1rem;
  width: 4rem;
  background: var(--neko-sidebar-background);
  border-radius: 5px;
`
