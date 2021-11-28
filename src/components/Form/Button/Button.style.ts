import { Theme } from '@/state/theme'
import styled, { css } from 'styled-components'

export const StyledButton = styled.button<{
  primary?: boolean
  secondary?: boolean
  light?: boolean
  dark?: boolean
  danger?: boolean
  warning?: boolean
  info?: boolean
  success?: boolean
  pill?: boolean
  theme: Theme
}>`
  border: 0;
  border-radius: 11px;

  outline: none;

  margin: 0;
  padding: 0.9rem 1.2rem;

  transition: ease-in-out box-shadow 0.15s;

  font-family: var(--inn-font);
  font-weight: 500;
  font-size: 1rem;

  color: #ffffff;

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  ${({
    primary,
    secondary,
    light,
    dark,
    danger,
    warning,
    info,
    success,
    theme
  }) => {
    if (primary)
      return css`
        background-color: ${theme.colors.primary};
      `
    else if (secondary)
      return css`
        background-color: ${theme.colors.secondary};
      `
    else if (light)
      return css`
        background-color: ${theme.colors.light};
      `
    else if (dark)
      return css`
        background-color: ${theme.colors.dark};
      `
    else if (danger)
      return css`
        background-color: ${theme.colors.danger};
      `
    else if (warning)
      return css`
        background-color: ${theme.colors.warning};
      `
    else if (info)
      return css`
        background-color: ${theme.colors.info};
      `
    else if (success)
      return css`
        background-color: ${theme.colors.success};
      `
  }}

  ${({ pill }) => {
    if (pill)
      return css`
        border-radius: 25px;
      `
  }}
`
