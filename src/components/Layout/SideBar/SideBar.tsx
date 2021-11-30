import { memo, Suspense, useCallback, useMemo } from 'react'
import { UI } from '@/state/ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faGrid, faComments } from '@fortawesome/pro-solid-svg-icons'
import { Button } from '@/components/Form'
import { DragDropContext, Droppable, Draggable } from '@react-forked/dnd'
import { useMedia } from 'react-use'
import { State } from '@/api/users'
import { ModalTypes } from '@/utils/constants'
import { useSuspenseStorageItem } from '@/utils/storage'
import { useCommunities, useCurrentUser, useUser } from '@/hooks/users'
import { FC } from 'react'
import { useCommunity } from '@/hooks/communities'
import { useMatches, useMatchRoute, useNavigate } from 'react-location'
import Avatar from '@/components/Avatar/Avatar'
import { StyledIconBadge } from '@/domain/User/Icon/Icon.style'
import {
  StyledSidebar,
  StyledSidebarButton,
  StyledSidebarIcon,
  StyledSidebarPinned,
  StyledSidebarPinnedWrapper,
  StyledSidebarPlaceholder,
  StyledSidebarScrollable,
  StyledSidebarSeperator
} from './Sidebar.style'

const reorder = (
  list: string[],
  startIndex: number,
  endIndex: number
): string[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const Community: FC<{
  id: string
  index: number
}> = memo(({ id: communityID, index }) => {
  const matches = useMatches()
  const navigate = useNavigate()
  const community = useCommunity(communityID)

  const draggableChild = useCallback(
    (provided) => (
      <StyledSidebarIcon
        key={communityID}
        style={provided.draggableProps.style}
        selected={!!matches.find((p) => p.params.id === communityID)}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={() => {
          if (matches.find((p) => p.params.id === communityID)) return
          return navigate({ to: `/app/communities/${communityID}` })
        }}
      >
        {community?.icon ? (
          <img src={community?.icon} alt={community?.name} />
        ) : (
          <Avatar username={community?.name} size='sidebar' />
        )}
      </StyledSidebarIcon>
    ),
    [communityID, community, matches]
  )

  return (
    <Draggable draggableId={communityID} index={index}>
      {draggableChild}
    </Draggable>
  )
})

const Placeholder: FC = () => {
  const length = useMemo(() => Math.floor(Math.random() * 10) + 1, [])
  return (
    <>
      {Array.from(Array(length).keys()).map((_, index) => (
        <StyledSidebarPlaceholder key={index} />
      ))}
    </>
  )
}

const Communities: FC = () => {
  const isMobile = useMedia('(max-width: 740px)')
  const communities = useCommunities()
  const [communitiesOrder, setCommunitiesOrder] =
    useSuspenseStorageItem<string[]>('communities')

  const onDragEnd = useCallback(
    (result) => {
      if (
        !result.destination ||
        result.destination.index === result.source.index
      )
        return
      const items = reorder(
        communities || [],
        result.source.index,
        result.destination.index
      )
      setCommunitiesOrder(items.map((c) => c))
    },
    [communities, setCommunitiesOrder]
  )

  const DroppableComponent = useCallback(
    (provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef}>
        {(communities ?? [])
          .sort(
            (a, b) =>
              (communitiesOrder?.indexOf(a) ?? 0) -
              (communitiesOrder?.indexOf(b) ?? 0)
          )
          .map((community, index) => (
            <Community key={community} id={community} index={index} />
          ))}
        {provided.placeholder}
      </div>
    ),
    [communities, communitiesOrder]
  )

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId='list'
        direction={isMobile ? 'horizontal' : 'vertical'}
      >
        {DroppableComponent}
      </Droppable>
    </DragDropContext>
  )
}

const SideBar: FC = () => {
  const ui = UI.useContainer()
  const matchRoute = useMatchRoute()
  const navigate = useNavigate()
  const user = useCurrentUser()

  return (
    <StyledSidebar>
      <StyledSidebarScrollable>
        <StyledSidebarButton
          selected={!!matchRoute({ to: '/app/hub' })}
          type='button'
          onClick={() => {
            navigate({ to: '/app/hub' })
          }}
        >
          <FontAwesomeIcon icon={faGrid} size='2x' />
        </StyledSidebarButton>
        <StyledSidebarButton
          selected={!!matchRoute({ to: '/app/conversations' })}
          type='button'
          onClick={() => {
            navigate({ to: '/app' })
          }}
        >
          <FontAwesomeIcon icon={faComments} size='2x' />
        </StyledSidebarButton>
        <StyledSidebarSeperator />
        <Suspense fallback={<Placeholder />}>
          <Communities />
        </Suspense>
        <br />
      </StyledSidebarScrollable>
      <StyledSidebarPinnedWrapper>
        <StyledSidebarPinned>
          <StyledSidebarButton
            selected={!!matchRoute({ to: '/app/settings' })}
            type='button'
            onClick={() => navigate({ to: '/app/settings' })}
          >
            <Avatar
              username={user?.username}
              avatar={user?.avatar}
              size='sidebar'
            />
            {!matchRoute({ to: '/app/settings' }) && user?.state && (
              <StyledIconBadge state={user.state} />
            )}
          </StyledSidebarButton>
          <StyledSidebarButton
            style={{ marginBottom: '0' }}
            type='button'
            onClick={() => ui.setModal({ name: ModalTypes.NEW_COMMUNITY })}
          >
            <FontAwesomeIcon icon={faPlus} size='2x' />
          </StyledSidebarButton>
        </StyledSidebarPinned>
      </StyledSidebarPinnedWrapper>
    </StyledSidebar>
  )
}

export default SideBar
