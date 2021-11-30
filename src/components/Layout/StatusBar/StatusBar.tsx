import { FC } from 'react'
import { StyledStatusBar } from './StatusBar.style'

const StatusBar: FC<{
  sidebar?: boolean
}> = ({ children, sidebar }) => {
  return <StyledStatusBar sidebar={sidebar}>{children}</StyledStatusBar>
}

export default StatusBar
