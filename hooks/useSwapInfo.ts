import { useQuery } from 'react-query'

import { usePoolsListQuery } from '../queries/usePoolsListQuery'
import { getSwapInfo, InfoResponse } from '../services/swap'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../util/constants'
import { useCosmWasmClient } from './useCosmWasmClient'

export type SwapInfo = Pick<
  InfoResponse,
  'base_denom' | 'quote_denom' | 'lp_token_address'
> & {
  swap_address: string
  lp_token_supply: number
  base_reserve: number
  quote_reserve: number
}

type UseMultipleSwapInfoArgs = {
  poolId?: string
  refetchInBackground?: boolean
}

export const useSwapInfo = ({
  poolId,
  refetchInBackground,
}: UseMultipleSwapInfoArgs) => {
  const { data: poolsListResponse } = usePoolsListQuery()
  const client = useCosmWasmClient()

  const { data, isLoading } = useQuery<SwapInfo>(
    `swapInfo/${poolId}`,
    async () => {
      const pool = poolsListResponse.poolsById[poolId]
      const swap = await getSwapInfo(pool.swap_address, client)

      return {
        ...swap,
        swap_address: pool.swap_address,
        base_reserve: Number(swap.base_reserve),
        quote_reserve: Number(swap.quote_reserve),
        lp_token_supply: Number(swap.lp_token_supply),
      }
    },
    {
      enabled: Boolean(poolsListResponse?.pools.length && client && poolId),
      refetchOnMount: false,
      refetchInterval: refetchInBackground
        ? DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL
        : undefined,
      refetchIntervalInBackground: refetchInBackground,
    }
  )

  return [data, isLoading] as const
}
