import { Theme } from '@/state/theme'
import styled, { css } from 'styled-components'

export const StyledSideView = styled.div<{
  theme?: Theme
}>`
  display: flex;
  flex-direction: column;
  max-width: 18rem;
  min-width: 18rem;
  min-height: 5rem;
  z-index: 0;
  overflow-y: scroll;
  padding: 1.5rem;
  background: ${({ theme }) => theme.channels?.background};
  border: 0;
  height: 100%;

  h1,
  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 800;

    span {
      float: right;
    }
  }

  hr {
    margin: 0 0 0 3.5rem;
    border-color: var(--neko-channels-seperator);
    opacity: 0.5;
    border-style: solid;
  }

  @media (max-width: 740px) {
    max-height: 100%;
    max-width: 100%;
    width: 100%;

    h2 {
      font-size: 2rem;
    }
  }
`

export const StyledSideViewList = styled.div`
  margin-top: 0.5rem;
`

export const StyledSideViewTab = styled.div<{
  selected?: boolean
  theme?: Theme
}>`
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  cursor: pointer;

  img {
    border-radius: 25px;
    object-fit: cover;
    height: 2.5rem;
    width: 2.5rem;
  }

  h4 {
    margin: 0 auto 0 0.75rem;
    font-weight: 500;
  }

  @media (max-width: 740px) {
    h4 {
      font-size: 1.05rem;
    }
  }

  ${({ theme, selected }) =>
    selected &&
    css`
      margin-left: -0.6rem;
      padding-left: 0.6rem;
      margin-right: -0.6rem;
      padding-right: 0.6rem;
      background-color: ${theme.channels?.card};
    `}
`

export const StyledSideViewIcon = styled.div<{
  theme?: Theme
}>`
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.text?.inverse};
  border-radius: 10px;

  @media (max-width: 740px) {
    font-size: 1.05rem;
  }
`
