import styled from 'styled-components'

export const AddMemberWrapper = styled.div`
  position: absolute;
  right: 2rem;
  top: calc(env(safe-area-inset-bottom) + 4rem);
  background: var(--neko-channels-background);
  border-radius: 12px;
  width: 240px;
  z-index: 10;
  form {
    display: block;
    width: 100%;

    position: relative;
    input {
      font-size: 0.8rem;
      font-weight: 400;
      width: 100%;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      background: var(--neko-channels-search);

      &::-webkit-input-placeholder {
        color: var(--neko-text-normal);
        opacity: 0.5;
      }
    }

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute !important;
      bottom: 0rem;
      font-size: 1rem;
      padding: 0 !important;
      right: 1.2rem !important;
      background: transparent !important;
      opacity: 0.5;
      height: 100%;
      width: auto !important;
    }
  }
`

export const FriendCard = styled.div`
  display: flex;
  align-items: center;
`
export const Friends = styled.div`
  padding: 1.2rem;
  display: flex;
  flex-direction: column;

  gap: 0.5rem;
`

export const FriendDetails = styled.div`
  display: flex;
  margin-left: 0.5rem;
  h1 {
    font-size: 1rem;
  }

  width: 100%;
  svg {
    margin-left: auto;
  }
`
