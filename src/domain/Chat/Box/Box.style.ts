import { StyledEditor } from '@/components/Form/Editor/Editor.style'
import { Theme } from '@/state/theme'
import { Editable } from 'slate-react'
import styled from 'styled-components'

export const StyledBoxPicker = styled.div<{
  theme?: Theme
}>`
  position: relative;
  aside {
    border-radius: 10px !important;
    position: absolute !important;
    z-index: 2 !important;
    bottom: 0.5rem;
    right: 2rem;
    border: none !important;
    color: ${({ theme }) => theme.text?.normal} !important;
    background: ${({ theme }) => theme.emojis?.background} !important;
    box-shadow: none !important;
    font-size: 1rem;
    input {
      background: ${({ theme }) => theme.emojis?.input};
      border: none !important;
      color: ${({ theme }) => theme.text?.normal};
    }

    ul::before {
      background: ${({ theme }) => theme.emojis?.background} !important;
      color: ${({ theme }) => theme.text?.normal} !important;
    }

    button {
      color: ${({ theme }) => theme.text?.normal} !important;
    }

    button:first-child {
      margin-left: 0;
    }
  }
`

export const StyledBox = styled(StyledEditor)<{
  theme?: Theme
}>`
  min-height: 3.125rem;
  display: flex;
  flex-direction: row;
  margin-bottom: 0;
  padding-left: 2rem;
  z-index: 2;
  padding-right: 2rem;
  justify-content: space-between;
  bottom: 0;
  width: 100%;

  a {
    color: ${({ theme }) => theme.text?.primary};
  }

  [contenteditable] {
    user-select: text;
    caret-color: var(--neko-input-text);
    -webkit-user-modify: read-write-plaintext-only;
    word-wrap: break-word;
    word-break: break-all;
  }
`

export const StyledBoxMentions = styled.div`
  position: relative;
  height: 0;
`

export const StyledBoxButtons = styled.div<{
  theme?: Theme
}>`
  display: flex;

  button {
    height: 3.125rem;
    width: 3.125rem;
    background: ${({ theme }) => theme.input?.background};
    color: ${({ theme }) => theme.input?.text};
    margin-left: 0.5rem;
    font-size: 1.05rem;
    position: relative;
    .badge {
      position: absolute;
      height: 18px;
      border-radius: 50%;
      width: 18px;
      bottom: -3.45px;
      right: -3.45px;
      border-color: ${({ theme }) => theme.sidebar?.background};
      border-width: 3.5px;
      border-style: solid;
      background: ${({ theme }) => theme.colors?.primary};
    }
  }
`

export const StyledBoxInput = styled(Editable)<{
  theme?: Theme
}>`
  word-break: break-word;
  overflow-y: auto;
  width: 100%;
  min-height: 3.125rem;
  max-height: 16.125rem;
  font-size: 1.05rem;
  margin: 0;
  padding: 0.9375rem;
  color: ${({ theme }) => theme.input?.text};
  background: ${({ theme }) => theme.input?.background};
  border-radius: 14px;
  font-weight: 300;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 5px;
    display: block;
  }

  &::placeholder {
    font-family: Inter, sans-serif;
    opacity: 0.65;
    font-weight: 300;
    color: ${({ theme }) => theme.input?.text};
    user-select: none;
    font-size: 1.05rem;
    -webkit-user-select: none;
    user-select: none;
    white-space: nowrap;
  }

  [contenteditable] {
    user-select: text;
    caret-color: var(--neko-input-text);
    -webkit-user-modify: read-write-plaintext-only;
    word-wrap: break-word;
    word-break: break-all;
  }
`

export const StyledBoxUploadInput = styled.input`
  display: none;
`

export const StyledBoxMissingPermissions = styled.div<{
  theme?: Theme
}>`
  overflow: hidden;
  width: 100%;
  max-width: calc(100% - 4rem);
  min-height: 3.125rem;
  max-height: 16.125rem;
  font-size: 1.05rem;
  padding: 0.9375rem;
  color: ${({ theme }) => theme.input?.text};
  background: ${({ theme }) => theme.input?.background};
  border-radius: 14px;
  font-weight: 300;
  overflow-x: hidden;
  user-select: none;
  margin: 0 2rem;
  opacity: 0.65;
  cursor: not-allowed;
  font-weight: 300;
`

export const StyledBoxPlaceholder = styled.div`
  display: flex;
  flex-direction: row;
  vertical-align: middle;
  align-items: center;
  margin-bottom: 0;
  padding-left: 2rem;
  margin-bottom: 2rem;
  padding-right: 2rem;
  justify-content: space-between;
  width: 100%;
  height: 3.125rem;
  min-height: 3.125rem;
`

export const StyledBoxPlaceholderButton = styled.div<{
  theme?: Theme
}>`
  height: 3.125rem;
  width: 3.125rem;
  background: ${({ theme }) => theme.input?.background};
  color: ${({ theme }) => theme.input?.text};
  margin-left: 0.5rem;
  font-size: 1.05rem;
  border-radius: 13px;
`

export const StyledBoxPlaceholderInput = styled.div<{
  theme?: Theme
}>`
  width: 100%;
  height: 3.125rem;
  margin: 0;
  flex: 1;
  padding-left: 0.9375rem;
  padding-right: 0.9375rem;
  background: ${({ theme }) => theme.input?.background};
  border: none;
  border-radius: 14px;
  outline: none;
`
