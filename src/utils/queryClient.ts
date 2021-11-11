import { QueryClient } from 'react-query'

export default new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      refetchOnWindowFocus: true,
      staleTime: Infinity
    }
  }
})
