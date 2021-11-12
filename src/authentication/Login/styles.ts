import styled from 'styled-components'

export const Wrapper = styled.div`
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
  }
  input {
    width: 100%;
  }
`

export const Heading = styled.h1`
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 0.2rem;
`
