import { ChannelResponse } from './remote'

export const useChannels = (): ChannelResponse[] => {
  return []
}

export const useCommunity = () => {
  return {
    id: '',
    name: '',
    icon: '',
    large: false,
    channels: []
  }
}
