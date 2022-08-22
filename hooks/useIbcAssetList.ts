import { useQuery } from 'react-query'

export type IBCAssetInfo = {
  id: string
  name: string
  symbol: string
  chain_id: string
  rpc: string
  denom: string
  decimals: number
  chihuahua_denom: string
  chihuahua_channel: string
  channel: string
  logoURI: string
  deposit_gas_fee?: number
  external_deposit_uri?: string
}

export type IBCAssetList = {
  tokens: Array<IBCAssetInfo>
}

export const useIBCAssetList = () => {
  const { data, isLoading } = useQuery<IBCAssetList>(
    '@ibc-asset-list',
    async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_IBC_ASSETS_URL)
      return await response.json()
    },
    {
      onError(e) {
        console.error('Error loading ibc asset list:', e)
      },
      refetchOnMount: false,
      refetchIntervalInBackground: true,
      refetchInterval: 1000 * 60,
    }
  )

  return [data, isLoading] as const
}
