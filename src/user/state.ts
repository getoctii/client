import { useQuery } from 'react-query'
import { Auth } from '../authentication/state'
import { getCurrentUser, getUser } from './remote'

export const useCurrentUser = () => {
  const { token } = Auth.useContainer()
  const { data: user } = useQuery(
    ['currentUser', token],
    async () => getCurrentUser(token!),
    {
      enabled: !!token
    }
  )
  return user
}

export const useUser = (userID?: string) => {
  const { token } = Auth.useContainer()
  const { data: user } = useQuery(
    ['users', userID, token],
    async () => getUser(userID!, token!),
    {
      enabled: !!token && !!userID
    }
  )

  return user
}
