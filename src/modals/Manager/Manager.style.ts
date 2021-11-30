import { Theme } from '@/state/theme'
import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

export const StyledModal = styled(motion.div)`
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`

export const StyledModalBackground = styled(motion.div)<{ blur?: boolean }>`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 5;
  background: ${({ theme }) => theme.modal?.background};

  ${({ blur }) =>
    blur &&
    css`
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    `}
`

export const StyledModalContent = styled(motion.div)<{ theme?: Theme }>`
  margin-top: 2rem;
  margin-bottom: 2rem;
  max-width: 50%;
  position: relative;
  border-radius: 16px;
  z-index: 10;
  background: ${({ theme }) => theme.modal?.foreground};
  overflow-y: auto;

  @media (max-width: 740px) {
    border-radius: 14px 14px 0 0;
    width: 100%;
    max-width: 100%;
    height: calc(100% - (env(safe-area-inset-top) + 2rem));
    margin: calc(env(safe-area-inset-top) + 2rem) 0 0;
    padding: 2rem 0 0;
  }
`
