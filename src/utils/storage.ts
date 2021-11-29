import { useCallback } from 'react'
import { useQuery } from 'react-query'
import queryClient from './queryClient'

export const useSuspenseStorageItem = <T>(
  key: string,
  initialValue?: T
): [T | undefined, (value: T) => void] => {
  const { data } = useQuery<T>(['storage', key, initialValue], async () => {
    const value = await localStorage.getItem(key)
    if (!value && !initialValue) return initialValue
    else if (!value && initialValue) {
      await localStorage.setItem(
        key,
        typeof value === 'string' ? value : JSON.stringify(initialValue)
      )
      return initialValue
    } else if (value) {
      if (value === 'undefined' || value === 'null') return undefined
      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    } else {
      return null
    }
  })

  const setValue = useCallback(
    async (value: T) => {
      try {
        await localStorage.setItem(
          key,
          typeof value === 'string' ? value : JSON.stringify(value)
        )

        queryClient.setQueryData(['storage', key, initialValue], value)
      } catch (error) {
        console.error(error)
      }
    },
    [key, initialValue]
  )

  return [data, setValue]
}
