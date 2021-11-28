import { Theme } from '@/state/theme'
import styled, { css } from 'styled-components'

export const ConversationWrapper = styled.div<{
  theme?: Theme
}>`
  background: ${({ theme }) => theme.chat?.background};
  width: 100%;
  height: 100%;
  display: flex;
`

export const ConversationInfo = styled.div<{
  theme?: Theme
}>`
  width: 20rem;
  background: ${({ theme }) => theme.channels?.background};
`

export const ConversationDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
`

export const ConversationMembers = styled.div`
  padding: 1.5rem;
`

export const ConversationName = styled.input<{
  editing?: boolean
  theme?: Theme
}>`
  font-size: 1.15rem;
  margin-top: 0.5rem;
  font-weight: 900;
  padding: 0.5rem 1rem 0.5rem 1rem;
  border-radius: 8px;
  border: 1px;
  text-align: center;
  border-style: solid;
  max-width: 12rem;
  border-color: transparent;
  &:hover {
    border: 1px;
    border-color: ${({ theme }) => theme.chat?.background};
    border-style: solid;
  }
  ${(props) =>
    props.editing &&
    css`
      background: ${({ theme }) => theme.chat?.background};
    `}
`

export const ConversationGroupType = styled.h1`
  font-size: 0.8rem;
  font-weight: 500;
  opacity: 0.8;
`

export const Seperator = styled.div<{
  theme: Theme
}>`
  height: 1px;
  background: ${({ theme }) => theme.channels?.seperator};
`

export const MembersHeading = styled.h1`
  font-size: 1rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  display: flex;
  position: relative;
  svg {
    margin-left: auto;
  }
`

export const ConversationMemberCard = styled.div`
  display: flex;
  margin-bottom: 0.8rem;
`

export const MemberDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 0.4rem;

  h1 {
    font-weight: 700;
  }

  p {
    font-size: 0.8rem;
    opacity: 0.7;
  }
`

export const ConversationActions = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
`

export const ConversationAction = styled.button<{
  primary?: boolean
  danger?: boolean
  theme?: Theme
}>`
  height: 2.2rem;
  width: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  ${(props) =>
    props.primary &&
    css`
      background: ${({ theme }) => theme.colors?.primary};
    `}

  ${(props) =>
    props.danger &&
    css`
      background: ${({ theme }) => theme.colors?.danger};
    `}
`
