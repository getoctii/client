import { Editable } from 'slate-react'
import styled from 'styled-components'

export const StyledEditor = styled.div`
  position: relative;

  -webkit-user-select: auto;
  -khtml-user-select: auto;
  -moz-user-select: auto;
  -o-user-select: auto;
  user-select: auto;
`

export const StyledEditorPlaceholder = styled.div`
  font-size: 1rem;
  font-weight: 400;
  opacity: 0.5;
  left: 2.9375rem;
  top: 1.0375rem;
  position: absolute;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 2rem;
  text-align: left;
  word-break: break-word;
  max-width: calc(100% - 9.25rem);
  user-select: none;
`

export const StyledEmptyDiv = styled.div``
export const StyledNotTypingEditor = styled(StyledEditor)``
export const StyledEmptyInput = styled(Editable)``
