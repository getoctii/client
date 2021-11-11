import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { log } from '../utils/logging'
import queryClient from '../utils/queryClient'

const useLog = (eventSource: EventSourcePolyfill | null) => {
  useEffect(() => {
    if (!eventSource) return
    const handler = async () => {
      log('Events', 'purple', 'Connection error')
      await queryClient.invalidateQueries()
    }

    eventSource.addEventListener('error', handler)

    return () => {
      eventSource.removeEventListener('error', handler)
    }
  }, [eventSource])

  useEffect(() => {
    if (!eventSource) return
    const handler = () => {
      log('Events', 'purple', 'Connected to event service')
    }

    eventSource.addEventListener('open', handler)

    return () => {
      eventSource.removeEventListener('open', handler)
    }
  }, [eventSource])
}

export default useLog
