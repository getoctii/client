import { createContainer } from '@innatical/innstate'
import { clientGateway } from '@/utils/constants'
import { ThemeBundle } from '@/state/theme'
import { db } from '@/utils/db'

const getPayloads = async (
  _: unknown,
  payloadKeys: [string, number][],
  token: string
) => {
  return await Promise.all(
    payloadKeys.map(async (key) => {
      const payload = await db.payloads.get({
        id: key[0],
        version: key[1]
      })
      if (payload) {
        return payload.data
      } else {
        const { data } = await clientGateway.get<{
          server: any[]
          themes: ThemeBundle[]
          client: any[]
        }>(`/products/${key[0]}/versions/${key[1]}/payload`, {
          headers: {
            Authorization: token
          }
        })
        await db.payloads.add({
          id: key[0],
          version: key[1],
          data
        })
        return data
      }
    })
  )
}

const useIntegrations = () => {
  // const auth = Auth.useContainer()
  // const { data: purchases } = useQuery(
  //   ['purchases', auth.id, auth.token],
  //   getPurchases,
  //   {
  //     enabled: auth.authenticated
  //   }
  // )
  // const payloadKeys = useMemo(
  //   () =>
  //     (purchases ?? [])
  //       ?.filter((purchase) => !!purchase.latest_version)
  //       .map((purchase) => [purchase.id, purchase.latest_version]),
  //   [purchases]
  // )
  // const { data: payloads } = useQuery<
  //   {
  //     server: any[]
  //     themes: ThemeBundle[]
  //     client: any[]
  //   }[]
  // >(['payloads', payloadKeys, auth.token], getPayloads, {
  //   enabled: auth.authenticated
  // })
  // return {
  //   payloads
  // }

  return {
    payloads: [] as any[]
  }
}

export default createContainer(useIntegrations)
