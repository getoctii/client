import styled from 'styled-components'

export const StyledNavbar = styled.div`
  max-width: 700px;
  width: 100%;
  display: flex;
  img,
  picture {
    width: 3rem;
    height: 3rem;
  }
  align-items: center;
`

export const StyledNavbarMarketing = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
  gap: 5px;
`

export const StyledNavbarButton = styled.div`
  cursor: pointer;
  border: 0;
  margin: 0;
  background: transparent;
  padding: 0;
  font-size: 1.2rem;
  opacity: 0.8;
  margin-left: auto;
  color: var(--neko-default-text);
`

export const StyledNavbarTitle = styled.div`
  font-size: 1.5rem;
  margin: 0;
  font-weight: 800;
  cursor: pointer;
  color: var(--neko-default-text);
`
