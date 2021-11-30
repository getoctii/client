import styled from 'styled-components'

export const StyledAlert = styled.div`
  padding: 2rem;
  width: 380px;
  div {
    display: flex;
    button {
      width: 100%;
    }
  }

  h3 {
    font-weight: 800;
    font-size: 1.25rem;
    margin-top: 0;
    margin-bottom: 0.3rem;
  }

  p {
    font-weight: 400;
    font-size: 1rem;
  }

  @media (max-width: 740px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
  }
`

export const StyledAlertSeperator = styled.div`
  width: 15px;
`
