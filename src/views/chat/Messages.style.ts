import { Theme } from '@/state/theme'
import styled from 'styled-components'

export const StyledMessages = styled.div`
  display: flex;
  flex-direction: column-reverse;
  margin-top: auto;
  max-height: 100%;
  overflow-y: scroll;
`

export const StyledMessagesLoader = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
  margin: 0 0 0.5rem;

  h5 {
    margin-bottom: 0;
  }
`

export const StyledMessagesTop = styled.div`
  margin-top: auto;
  padding-top: 8rem;
  h3 {
    font-size: 1.4rem;
    margin-bottom: 0;
  }
  padding-left: 2rem;
  padding-right: 2rem;
`

export const StyledMessagesIndicator = styled.div<{ theme: Theme }>`
  background: ${({ theme }) => theme.text?.primary};
  height: 1px;

  margin: 0.5rem 2rem;
  border-radius: 12px;
  position: relative;
  hr {
    opacity: 0;
  }

  span {
    position: absolute;
    right: 0;
    padding: 0.5rem;
    border-radius: 10px;
    top: -0.98rem;
    font-size: 0.7rem;
    font-weight: 300;
    background: ${({ theme }) => theme.text?.primary};
  }
`

export const StyledMessagesBuffer = styled.div`
  margin-bottom: 1.5rem;
`

export const StyledMessagesWaypoint = styled.div`
  height: 1px;
`

export const StyledMessagesNoKeychain = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;

  h1 {
    margin-bottom: 0;
    font-size: 1.5rem;
  }

  h2 {
    margin-top: 0.5rem;
    font-size: 1.1rem;
    font-weight: 300;
  }
`
