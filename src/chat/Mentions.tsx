import { FC, memo, useEffect, useMemo, useState } from 'react'
import { useQueries, useQuery } from 'react-query'
import styles from './Mentions.module.scss'
import { fetchManyUsers, getUser, UserResponse } from '../user/remote'
import { Auth } from '../authentication/state'
import { clientGateway } from '../utils/constants'
import { useDebounce, useMedia } from 'react-use'
import { ChannelResponse, getChannels, getMembers } from '../community/remote'
import { useParams, useRouteMatch } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { useConversation, useConversationMembers } from '../conversation/state'
import { useChannels } from '../community/state'

type onMention = (id: string, type: 'user' | 'channel') => void

const User: FC<{
  user?: UserResponse
  onMention: onMention
  selected: boolean
}> = ({ user, onMention, selected }) => {
  if (!user) return <></>
  return (
    <div
      className={`${styles.mention} ${selected ? styles.selected : ''}`}
      onClick={() => onMention(user.id, 'user')}
    >
      <div
        className={styles.img}
        style={{ backgroundImage: `url('${user?.avatar}')` }}
      />
      {user?.username}#
      {user?.discriminator === 0
        ? 'inn'
        : user?.discriminator.toString().padStart(4, '0')}
    </div>
  )
}

const Channel: FC<{
  channel?: ChannelResponse
  onMention: onMention
  selected: boolean
}> = ({ channel, onMention, selected }) => {
  return (
    <div
      className={`${styles.mention} ${selected ? styles.selected : ''}`}
      onClick={() => channel && onMention(channel.id, 'channel')}
    >
      #{channel?.name}
    </div>
  )
}

const MentionsPopup: FC<{
  usersIDs: string[]
  search?: string
  onMention: onMention
  selected: number
  onFiltered: (users: (UserResponse | undefined)[]) => void
}> = ({ usersIDs, search, selected, onMention, onFiltered }) => {
  const { token } = Auth.useContainer()

  const users = useQueries(
    (usersIDs ?? []).map((userID) => {
      return {
        queryKey: ['user', userID, token],
        queryFn: async () => getUser(userID, token!)
      }
    })
  )
  const results = useMemo(
    () =>
      search && search !== ''
        ? users
            ?.filter(({ data: user }) => user?.username.includes(search))
            .map(({ data: user }) => user)
        : users.map(({ data: user }) => user),
    [users, search]
  )
  useEffect(() => {
    onFiltered(results ?? [])
  }, [results, onFiltered])
  return (
    <div
      className={styles.mentionPopup}
      onMouseDown={(e) => {
        e.preventDefault()
      }}
    >
      <div className={styles.mentions}>
        {users?.map(({ data: user }, index) => (
          <User
            key={user?.id}
            user={user}
            onMention={onMention}
            selected={index === selected}
          />
        ))}
      </div>
    </div>
  )
}

const Conversation: FC<{
  search: string
  onMention: onMention
  selected: number
  onFiltered: (users: (UserResponse | undefined)[]) => void
}> = ({ search, onMention, selected, onFiltered }) => {
  const { token, id } = Auth.useContainer()
  const match = useRouteMatch<{ id: string }>('/conversations/:id')
  const conversationMembers = useConversationMembers(match?.params.id)
  return (
    <ErrorBoundary fallback={<></>}>
      <MentionsPopup
        usersIDs={conversationMembers
          ?.filter((member) => member.userID !== id)
          .map((m) => m.userID)}
        selected={selected}
        search={search}
        onMention={onMention}
        onFiltered={onFiltered}
      />
    </ErrorBoundary>
  )
}

const searchCommunityMembers = async (
  _: string,
  id: string,
  query: string,
  token: string
) =>
  query.length >= 1 && query.length <= 16 && /^[a-zA-Z ]+$/.test(query)
    ? (
        await clientGateway.get<
          {
            id: string
            user: UserResponse
          }[]
        >(`/communities/${id}/members/search`, {
          headers: {
            Authorization: token
          },
          params: {
            query
          }
        })
      ).data
    : []

const Channels: FC<{
  search: string
  onMention: onMention
  selected: number
}> = memo(({ search, onMention, selected }) => {
  const params = useParams<{ id: string }>()
  const { token } = Auth.useContainer()
  const communityChannels = useChannels()
  const channels = useMemo(
    () =>
      search !== ''
        ? communityChannels?.filter((channel) => channel.name.includes(search))
        : communityChannels,
    [communityChannels, search]
  )

  return (
    <div
      className={styles.mentionPopup}
      onMouseDown={(e) => {
        e.preventDefault()
      }}
    >
      <div className={styles.mentions}>
        {channels &&
          channels?.length > 0 &&
          channels?.map((channel, index) => (
            <Channel
              key={channel.id}
              channel={channel}
              onMention={onMention}
              selected={index === selected}
            />
          ))}
      </div>
    </div>
  )
})

const Users: FC<{
  search: string
  onMention: onMention
  selected: number
  onFiltered: (users: (UserResponse | undefined)[]) => void
}> = memo(({ search, onMention, selected, onFiltered }) => {
  const params = useParams<{ id: string }>()
  const { token, id } = Auth.useContainer()
  const isMobile = useMedia('(max-width: 740px)')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  useDebounce(() => setDebouncedSearch(search), 300, [search])
  const { data: members } = useQuery(
    ['members', params.id, debouncedSearch, token],
    async () => searchCommunityMembers('', params.id, debouncedSearch, token!)
  )
  const defaultMembers = useQuery(['members', params.id, token], async () =>
    getMembers('', params.id, token!, '')
  )

  const filteredMembers = useMemo(
    () => members?.filter((member) => member.id !== id),
    [members, id]
  )

  const truncatedDefaultMembers = useMemo(
    () =>
      isMobile
        ? defaultMembers.data?.slice(0, 4)
        : defaultMembers.data?.slice(0, 9),
    [defaultMembers, isMobile]
  )
  const truncatedFilteredMembers = useMemo(
    () => filteredMembers?.slice(0, 9),
    [filteredMembers]
  )

  return (
    <MentionsPopup
      usersIDs={
        truncatedFilteredMembers && truncatedFilteredMembers.length > 0
          ? truncatedFilteredMembers
              .filter((member) => member.user.id !== id)
              .map((member) => member.user.id)
          : truncatedDefaultMembers
          ? truncatedDefaultMembers
              .filter((member) => member.user_id !== id)
              .map((m) => m.user_id)
          : []
      }
      onMention={onMention}
      selected={selected}
      onFiltered={onFiltered}
    />
  )
})

const Mentions = { Conversation, Community: { Users, Channels } }

export default Mentions
