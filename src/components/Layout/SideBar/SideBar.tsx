import { memo, Suspense, useCallback, useMemo } from 'react'
import styles from './SideBar.module.scss'
import { UI } from '@/state/ui'
import { Auth } from '@/state/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faInbox,
  faPlus,
  faGrid,
  faComments
} from '@fortawesome/pro-solid-svg-icons'
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
  // const unreads = useQuery(['unreads', id, token], getUnreads)
  // const mentions = useQuery(['mentions', id, token], getMentions)

  // const mentionsCount = useMemo(
  //   () =>
  //     communityFull.data?.channels
  //       .map(
  //         (channel) =>
  //           mentions.data?.[channel]?.filter((mention) => !mention.read)
  //             .length ?? 0
  //       )
  //       .reduce((acc, curr) => acc + curr, 0),
  //   [communityFull, mentions]
  // )

  const draggableChild = useCallback(
    (provided) => (
      <div
        key={communityID}
        style={provided.draggableProps.style}
        className={
          matches.find((p) => p.params.id === communityID)
            ? `${styles.icon} ${styles.selected}`
            : styles.icon
        }
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
        {/* {match?.params.id !== community.id &&
          (mentionsCount && mentionsCount > 0 ? (
            <div
              className={`${styles.mention} ${
                mentionsCount > 9 ? styles.pill : ''
              }`}
            >
              <span>{mentionsCount > 99 ? '99+' : mentionsCount}</span>
            </div>
          ) : (
            communityFull.data?.channels.some((channelID) => {
              const channel = unreads.data?.[channelID]
              return channel?.last_message_id !== channel?.read
            }) && <div className={`${styles.badge}`} />
          ))} */}
      </div>
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
        <div key={index} className={styles.communityPlaceholder} />
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
      <div
        className={styles.list}
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
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
  const isMobile = useMedia('(max-width: 740px)')
  const matchRoute = useMatchRoute()
  const navigate = useNavigate()
  const user = useCurrentUser()

  // const scrollRef = useRef<HTMLDivElement>(null)
  // const currentScrollPosition = useScroll(scrollRef)
  // const {
  //   sidebar: [scrollPosition, setScrollPosition]
  // } = ScrollPosition.useContainer()
  // const unreads = useQuery(['unreads', auth.id, auth.token], getUnreads)
  // const mentions = useQuery(['mentions', auth.id, auth.token], getMentions)

  // const mentionsCount = useMemo(
  //   () =>
  //     participants.data
  //       ?.filter((part) => part.conversation.participants.length > 1)
  //       .map(
  //         (part) =>
  //           mentions.data?.[part.conversation.channel_id]?.filter(
  //             (mention) => !mention.read
  //           ).length ?? 0
  //       )
  //       .reduce((acc, curr) => acc + curr, 0),
  //   [participants, mentions]
  // )

  // useLayoutEffect(() => {
  //   if (scrollRef.current)
  //     scrollRef.current.scrollTo(scrollPosition.x, scrollPosition.y)
  //   // eslint-disable-next-line
  // }, [])

  // useEffect(() => {
  //   setScrollPosition(currentScrollPosition)
  // }, [currentScrollPosition, setScrollPosition])
  return (
    <div className={styles.sidebar}>
      {/* This doesnt fucking work
            Hours Wasted: 3 
        */}
      {/* 
      {window.inntronType === 'native' && window.inntronPlatform === 'macos' ? (
        <div className={styles.spacer} />
      ) : (
        <></>
      )} */}
      <div className={styles.scrollable} /*ref={scrollRef}*/>
        {isMobile && (
          <>
            <Button
              type='button'
              className={`${styles.avatar} ${
                matchRoute({ to: '/app/settings' }) ? styles.selected : ''
              }`}
            >
              <Avatar username={user?.username} avatar={user?.avatar} />
              {/* <img
                src={user?.avatar}
                alt={user?.username}
                onClick={() => navigate({ to: '/app/settings' })}
              /> */}
              <div
                className={styles.overlay}
                onClick={() => navigate({ to: '/app/settings' })}
              />
              {user?.state && (
                <div
                  className={`${styles.badge} ${
                    user.state === State.ONLINE
                      ? styles.online
                      : user.state === State.DND
                      ? styles.dnd
                      : user.state === State.IDLE
                      ? styles.idle
                      : user.state === State.OFFLINE
                      ? styles.offline
                      : ''
                  }`}
                />
              )}
            </Button>
            <Button
              className={styles.plus}
              type='button'
              onClick={() => ui.setModal({ name: ModalTypes.NEW_COMMUNITY })}
            >
              <FontAwesomeIcon
                className={styles.symbol}
                icon={faPlus}
                size='2x'
              />
            </Button>
          </>
        )}
        <Button
          className={`${styles.hub} ${
            matchRoute({ to: '/app/hub' }) ? styles.selected : ''
          }`}
          type='button'
          onClick={() => {
            navigate({ to: '/app/hub' })
          }}
        >
          <FontAwesomeIcon className={styles.symbol} icon={faGrid} size='2x' />
        </Button>
        <Button
          className={`${styles.messages} ${
            matchRoute({ to: '/app/conversations' }) ? styles.selected : ''
          }`}
          type='button'
          onClick={() => {
            navigate({ to: '/app' })
          }}
        >
          <FontAwesomeIcon
            className={styles.symbol}
            icon={faComments}
            size='2x'
          />
          {/* {matchTab?.params.tab !== 'conversations' &&
            matchTab &&
            (mentionsCount && mentionsCount > 0 ? (
              <div
                className={`${styles.mention} ${
                  mentionsCount > 9 ? styles.pill : ''
                }`}
              >
                <span>{mentionsCount > 99 ? '99+' : mentionsCount}</span>
              </div>
            ) : (
              participants.data
                ?.filter((part) => part.conversation.participants.length > 1)
                .some((participant) => {
                  const channel =
                    unreads.data?.[participant.conversation.channel_id]
                  return channel?.last_message_id !== channel?.read
                }) && <div className={`${styles.badge}`} />
            ))} */}
        </Button>
        <div className={styles.separator} />
        <Suspense fallback={<Placeholder />}>
          <Communities />
        </Suspense>
        <br />
      </div>
      {!isMobile && (
        <div className={styles.pinned}>
          <div className={styles.pinnedWrapper}>
            <Button
              className={`${styles.avatar} ${
                matchRoute({ to: '/app/settings' }) ? styles.selected : ''
              }`}
              type='button'
              onClick={() => navigate({ to: '/app/settings' })}
            >
              <Avatar
                username={user?.username}
                avatar={user?.avatar}
                size='sidebar'
              />
              {/* <img
                src={user?.avatar}
                alt={user?.username}
                onClick={() => {
                  navigate({ to: '/app/settings' })
                }}
              /> */}
              {!matchRoute({ to: '/app/settings' }) && user?.state && (
                <div
                  className={`${styles.badge} ${
                    user.state === State.ONLINE
                      ? styles.online
                      : user.state === State.DND
                      ? styles.dnd
                      : user.state === State.IDLE
                      ? styles.idle
                      : user.state === State.OFFLINE
                      ? styles.offline
                      : ''
                  }`}
                />
              )}
            </Button>
            <Button
              className={styles.plus}
              type='button'
              onClick={() => ui.setModal({ name: ModalTypes.NEW_COMMUNITY })}
            >
              <FontAwesomeIcon
                className={styles.symbol}
                icon={faPlus}
                size='2x'
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SideBar
