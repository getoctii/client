import { Button } from '@/components/Form'
import { ErrorMessage, Field } from 'formik'
import styled from 'styled-components'

export const StyledRegister = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--neko-default-gradient-background);
  width: 100%;

  form {
    max-width: 325px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  input {
    width: 100%;
  }
`

export const StyledRegisterHeading = styled.h1`
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 0.2rem;
`

export const StyledRegisterInput = styled(Field)`
  display: block;
  border: none;
  padding: 0;
  padding-left: 0.9375rem !important;
  padding-right: 0.9375rem !important;
  border-radius: 8px;
  min-height: 3.75rem;
  height: 3.75rem;
  margin: 0 0 0.25rem;
  font-size: 1.1875rem;
  background: var(--neko-default-foreground);
  color: var(--neko-default-text);
`

export const StyledRegisterLabel = styled.label`
  margin-top: 0.8rem;
  display: inline-block;
  color: var(--neko-default-text);
  margin-bottom: 0.25rem;
`

export const StyledRegisterButton = styled(Button)`
  min-height: 3.75rem;
  height: 3.75rem;

  margin-top: 1.2rem;
  margin-bottom: 1rem;
`

export const StyledRegisterError = styled(ErrorMessage)`
  margin-top: 0.25rem;
  margin-bottom: 0;
  color: var(--neko-default-danger);
`
