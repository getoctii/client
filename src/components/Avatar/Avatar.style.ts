import styled, { css } from 'styled-components'

export const AvatarImage = styled.div<{
  size?: 'message' | 'conversation' | 'sidebar' | 'friend'
}>`
  min-width: 2.65rem;
  min-height: 2.65rem;
  width: 2.65rem;
  height: 2.65rem;
  object-fit: cover;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  ${({ size }) => {
    if (size === 'conversation')
      return css`
        height: 3rem;
        width: 3rem;
        min-height: 3rem;
        min-width: 3rem;
      `
    else if (size === 'sidebar')
      return css`
        width: 3.5rem;
        height: 3.5rem;
        min-height: 3.5rem;
        min-width: 3.5rem;
        border-radius: 16px;
      `
    else if (size === 'friend')
      return css`
        width: 45px;
        height: 45px;
        min-width: 45px;
        min-height: 45px;
        border-radius: 10px;
      `
  }}
`

export const AvatarPlaceholder = styled.div<{
  size?: 'message' | 'conversation' | 'sidebar' | 'friend'
}>`
  min-width: 2.65rem;
  min-height: 2.65rem;
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    margin-left: 0;
    font-size: 1rem;
  }
  ${({ size }) => {
    if (size === 'conversation')
      return css`
        height: 3rem;
        width: 3rem;
        min-height: 3rem;
        min-width: 3rem;
        font-size: 1.25rem;
      `
    else if (size === 'sidebar')
      return css`
        width: 3.5rem;
        height: 3.5rem;
        min-height: 3.5rem;
        min-width: 3.5rem;
        border-radius: 16px;
        font-size: 1.5rem;
      `
    else if (size === 'friend')
      return css`
        height: 36px;
        width: 36px;
        min-height: 36px;
        min-width: 36px;
        border-radius: 10px;
        margin-right: 0.5rem;
      `
  }}
`
