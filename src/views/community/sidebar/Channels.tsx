import { useCallback, useMemo, FC } from 'react'
import styles from './Channels.module.scss'
import {
  ChannelTypes,
  clientGateway,
  ModalTypes,
  Permissions
} from '../../../utils/constants'
import ChannelCard from './channel/ChannelCard'
import { useQueries } from 'react-query'
import { Auth } from '@/state/auth'
import { ChannelResponse } from '@/api/communities'
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult
} from '@react-forked/dnd'
import {
  CategoryCardView,
  CategoryChannelsDraggable
} from './channel/CategoryCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/pro-solid-svg-icons'
import { Permission } from '../../../utils/permissions'
import { UI } from '../../../state/ui'
import { useMatch } from 'react-location'
import { useChannels } from '@/hooks/communities'
import { getChannel } from '@/api/messages'

const insert = (
  list: ChannelResponse[],
  index: number,
  item: ChannelResponse
) => {
  const result = Array.from(list)
  result.splice(index, 0, item)
  return result
}

const reorder = (
  list: ChannelResponse[],
  startIndex: number,
  endIndex: number
): ChannelResponse[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

type Categories = {
  [key in string]: {
    type: ChannelTypes
    children: ChannelResponse[]
  }
}

const groupByCategories = (channels: ChannelResponse[]) => {
  const items: Categories = {}
  const categories = channels
    .filter(
      (channel) => channel?.type === ChannelTypes.CATEGORY || !channel?.parentID
    )
    .sort((a, b) => a.order - b.order)
  categories.forEach((category) => {
    if (category.type !== ChannelTypes.CATEGORY) {
      items['unassigned'] = {
        type: ChannelTypes.CATEGORY,
        children: [...(items['unassigned']?.children ?? []), category]
      }
      return
    }
    const categoryChildren = channels
      .filter((channel) => channel?.parentID === category.id)
      .sort((a, b) => a.order - b.order)
    items[category.id] = {
      type: category.type,
      children: categoryChildren
    }
  })

  return items
}

interface Dropper extends DropResult {
  type: string
}

const ChannelsView: FC = () => {
  const auth = Auth.useContainer()
  const {
    params: { id }
  } = useMatch()
  const channelIDs = useChannels(id)
  const ui = UI.useContainer()
  const { hasPermissions } = Permission.useContainer()

  const channels = useQueries(
    (channelIDs ?? []).map((channelID) => ({
      queryKey: ['channel', channelID, auth.token],
      queryFn: async () => await getChannel(channelID, auth.token!)
    }))
  )

  const groupedChannels = useMemo(() => {
    return groupByCategories(
      (channels.map((c) => c.data).filter((c) => !!c) as any) ?? []
    )
  }, [channels])
  const onDragEnd = useCallback(
    async (result: Dropper) => {
      if (!result.destination) return
      const channel = channels?.find(
        ({ data: c }) => c?.id === result.draggableId
      )
      if (!channel) return
      if (result.type === 'children') {
        const parentChildren = groupedChannels[result.destination.droppableId]
        const destinationParentID =
          result.destination?.droppableId === 'unassigned'
            ? undefined
            : result.destination?.droppableId
        const previousChannel =
          result.destination.index === 0
            ? undefined
            : parentChildren?.children?.[result.destination.index - 1] ??
              undefined
        const brothers =
          channels?.filter(
            ({ data: c }) =>
              (!destinationParentID &&
                c?.type === ChannelTypes.TEXT &&
                !c?.parentID &&
                c.id !== channel.data?.id) ||
              c?.parentID === destinationParentID
          ) ?? []
        const newBrothers =
          channel?.data?.parentID !== destinationParentID
            ? insert(
                brothers.map((c) => c.data) as any,
                result.destination.index,
                channel as any
              )
            : reorder(
                brothers.map((c) => c.data) as any,
                result.source.index,
                result.destination?.index ?? 0
              )
        const otherChannels =
          channels?.filter(
            ({ data: c }) =>
              c?.type === ChannelTypes.CATEGORY ||
              (c?.parentID !== destinationParentID &&
                c?.id !== channel.data?.id)
          ) ?? []
        // queryClient.setQueryData<ChannelResponse[]>(
        //   ['channels', id, auth.token],
        //   [
        //     ...otherChannels,
        //     ...newBrothers.map((c, index) => ({
        //       ...c,
        //       parentID:
        //         result.destination?.droppableId === 'unassigned'
        //           ? undefined
        //           : result.destination?.droppableId,
        //       order: index + 1
        //     }))
        //   ]
        // )
        await clientGateway.patch(
          `/channels/${channel.data?.id}`,
          {
            parent: destinationParentID ?? null,
            previous_channel_id: previousChannel?.id ?? null
          },
          {
            headers: {
              Authorization: auth.token
            }
          }
        )
      } else {
        const parents = channels?.filter(
          ({ data: c }) => c?.type === ChannelTypes.CATEGORY
        )
        if (!parents) return
        const previousChannel =
          parents[
            result.destination.index === 0
              ? result.destination.index - 1
              : result.destination.index
          ]

        const newParents = reorder(
          parents as any,
          result.source.index,
          result.destination?.index ?? 0
        )

        const nonParents =
          channels?.filter(
            ({ data: c }) => c?.type !== ChannelTypes.CATEGORY
          ) ?? []
        // queryClient.setQueryData<ChannelResponse[]>(
        //   ['channels', match?.params.id, auth.token],
        //   [
        //     ...nonParents,
        //     ...newParents.map((c, index) => ({
        //       ...c,
        //       order: index + 1
        //     }))
        //   ]
        // )
        await clientGateway.patch(
          `/channels/${channel.data?.id}`,
          {
            parent: null,
            previous_channel_id: previousChannel?.data?.id ?? null
          },
          {
            headers: {
              Authorization: auth.token
            }
          }
        )
      }
    },
    [auth.token, channels, groupedChannels]
  )

  const DroppableComponent = useCallback(
    (provided: DroppableProvided) => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {Object.keys(groupedChannels)
          .filter((c) => c !== 'unassigned')
          .map((key, index) => (
            <CategoryCardView
              key={key}
              id={key}
              index={index}
              name={
                channels?.find(({ data: c }) => c?.id === key)?.data?.name ?? ''
              }
              items={groupedChannels[key].children.map((c) => c.id)}
            />
          ))}
        {provided.placeholder}
      </div>
    ),
    [channels, groupedChannels]
  )

  return (
    <div className={styles.channels}>
      <h4 className={styles.rooms}>
        Rooms
        {hasPermissions([Permissions.MANAGE_CHANNELS]) && (
          <span>
            <FontAwesomeIcon
              className={styles.add}
              icon={faPlus}
              onClick={() =>
                ui.setModal({
                  name: ModalTypes.NEW_CHANNEL,
                  props: { communityID: id }
                })
              }
            />
          </span>
        )}
      </h4>
      <div className={styles.list}>
        {(Object.keys(groupedChannels)?.length ?? 0) > 0 ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <CategoryChannelsDraggable
              key={'unassigned'}
              id={'unassigned'}
              items={
                groupedChannels['unassigned']?.children?.map((c) => c.id) ?? []
              }
            />
            <Droppable droppableId={'channels'} type={'parents'}>
              {DroppableComponent}
            </Droppable>
          </DragDropContext>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

const ChannelsPlaceholder: FC = () => {
  const length = useMemo(() => Math.floor(Math.random() * 10) + 1, [])
  return (
    <div className={styles.channelsPlaceholder}>
      <div className={styles.rooms} />
      {Array.from(Array(length).keys()).map((_, index) => (
        <ChannelCard.Placeholder key={index} index={index} />
      ))}
    </div>
  )
}

const Channels = { View: ChannelsView, Placeholder: ChannelsPlaceholder }

export default Channels
