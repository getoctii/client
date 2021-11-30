import { Theme } from '@/state/theme'
import styled, { css } from 'styled-components'

export const StyledModal = styled.div`
  max-width: 380px;
  width: 380px;

  @media (max-width: 740px) {
    max-width: 100%;
    display: flex;
    padding: 0;
    margin: 0;
    width: 100%;
    flex-direction: column;
    height: 100%;
  }
`

export const StyledModalSpacer = styled.div`
  height: 2rem;
`

export const StyledModalHeader = styled.div`
  padding-top: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 1rem;
  display: flex;
  align-items: center;
  h2 {
    font-size: 1.2rem;
    margin: 0;
  }

  @media (max-width: 740px) {
    padding-top: 0;
  }
`

export const StyledModalHeaderIcon = styled.div<{
  theme?: Theme
}>`
  background-color: ${({ theme }) => theme.colors.secondary};
  margin-right: 0.7rem;
  padding: 0.5rem;
  height: 2.65rem;
  width: 2.65rem;
  border-radius: 12px;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text.inverse};
  cursor: pointer;
  svg {
    align-self: center;
  }
  display: flex;
  vertical-align: middle;
  justify-content: center;
`

export const StyledModalBody = styled.div<{
  bottom?: boolean
}>`
  padding: 2rem;
  padding-top: 0;

  ${({ bottom }) =>
    bottom &&
    css`
      padding-bottom: 1.25rem;
    `}
`

export const StyledModalBottom = styled.div<{
  theme?: Theme
}>`
  background-color: ${({ theme }) => theme.channels.background};
  padding: 1.25rem 2rem 2rem;
  button {
    width: 100%;
  }
  @media (max-width: 740px) {
    padding-top: 2rem;
  }

  @media (max-width: 740px) {
    margin-top: auto;
    padding: 1.25rem 2rem calc(env(safe-area-inset-bottom) + 2rem);
  }
`
