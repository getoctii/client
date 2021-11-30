import { IconDefinition } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, ReactNode } from 'react'
import { useMatchRoute, useNavigate } from 'react-location'

import {
  StyledSideView,
  StyledSideViewIcon,
  StyledSideViewList,
  StyledSideViewTab
} from './SideView.style'

const SideView: FC<{
  name: string
  tabs: {
    name: string
    icon: IconDefinition
    color: string
    link: string
  }[]
  children?: ReactNode
}> = ({ name, tabs, children }) => {
  const navigate = useNavigate()
  const matchRoute = useMatchRoute()

  return (
    <StyledSideView>
      <h1>{name}</h1>
      <StyledSideViewList>
        {tabs.map((tab) => (
          <StyledSideViewTab
            key={tab.name}
            selected={!!matchRoute({ to: `${tab.name.toLowerCase()}` })}
            onClick={() => navigate({ to: tab.link })}
          >
            <StyledSideViewIcon>
              <FontAwesomeIcon icon={tab.icon} fixedWidth />
            </StyledSideViewIcon>
            {tab.name}
          </StyledSideViewTab>
        ))}
      </StyledSideViewList>
      {children}
    </StyledSideView>
  )
}

export default SideView
