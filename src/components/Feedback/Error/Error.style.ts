import { Theme } from '@/state/theme'
import styled from 'styled-components'

export const StyledError = styled.div<{
  theme: Theme
}>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5rem;
  text-align: center;
  color: ${({ theme }) => theme.text?.normal};
  background: ${({ theme }) => theme.backgrounds?.primary};
  gap: 10px;
  h1 {
    margin: 1rem 0 0;
    font-weight: 900;
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors?.primary};
  }

  svg {
    color: ${({ theme }) => theme.colors?.primary};
  }

  p {
    max-width: 300px;
  }
`
