import { FC } from 'react'
import { SyncLoader } from 'react-spinners'
import { StyledLoader } from './Loader.style'

const Loader: FC = () => {
  return (
    <StyledLoader>
      <SyncLoader />
    </StyledLoader>
  )
}

export default Loader
