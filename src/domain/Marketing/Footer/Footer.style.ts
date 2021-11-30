import styled from 'styled-components'

export const StyledFooter = styled.div`
  width: 100%;
  padding: 3.5rem;
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    text-align: center;
    margin: 0;
    margin-top: 1rem;
    margin-bottom: 0.35rem;
    color: var(--neko-default-text);
  }

  h3 {
    margin: 0;
    color: var(--neko-default-text);
    font-size: 1rem;
    font-weight: 800;
  }
`

export const StyledFooterSocials = styled.div`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: auto auto;

  a {
    color: var(--neko-default-text);
  }
`
