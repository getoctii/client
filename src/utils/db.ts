import Dexie, { Table } from 'dexie'

export interface Payload {
  id: string
  version: number
  data: any
}

export class IntegrationStore extends Dexie {
  payloads!: Table<Payload>

  constructor() {
    super('integrations')
    this.version(1).stores({
      payloads: '[id+version], data'
    })
  }
}

export const db = new IntegrationStore()
