import { protectAgainstNaN, usePersistance } from 'junoblocks'
import { useMemo } from 'react'
import { useQueries } from 'react-query'
import { useRecoilValue } from 'recoil'
import { useCosmWasmClient } from '../hooks/useCosmWasmClient'
import { walletState } from '../state/atoms/walletAtoms'
import { queryMyLiquidity } from './queryMyLiquidity'
import { querySwapInfo } from './querySwapInfo'
import { useGetBaseTokenDollarValueQuery } from './useGetBaseTokenDollarValueQuery'
import { convertMicroDenomToDenom } from 'util/conversion'
import { POOL_TOKENS_DECIMALS } from 'util/constants'
import { PoolEntityType, usePoolsListQuery } from './usePoolsListQuery'
import {
  DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
} from '../util/constants'

export type PoolLiquidityState = {
  total_lp_amount: number,
  provided_lp_amount: number,
  base_reserve: number,
  quote_reserve: number,
  total_liquidity_in_usd: number,
  provided_liquidity_in_usd: number,
  base_token_price_in_usd: number,
}

export type PoolEntityTypeWithLiquidity = PoolEntityType & {
  liquidity: PoolLiquidityState
}

type QueryMultiplePoolsArgs = {
  pools: Array<PoolEntityType>
  refetchInBackground?: boolean
}

export const useQueryMultiplePoolsLiquidity = ({
  pools,
  refetchInBackground = false,
}: QueryMultiplePoolsArgs) => {
  const [get_base_token_dollar_value, enabledGetTokenDollarValue] =
    useGetBaseTokenDollarValueQuery()
  const { address, client: signingClient } = useRecoilValue(walletState)
  const context = {
    client: useCosmWasmClient(),
    signingClient,
    get_base_token_dollar_value,
  }

  async function queryPoolLiquidity(
    pool: PoolEntityType
  ): Promise<PoolEntityTypeWithLiquidity> {
    const base_token_price_in_usd = await get_base_token_dollar_value()

    const swap_info = await querySwapInfo({
      context,
      swap_address: pool.swap_address,
    })

    const { provided_lp_in_micro_denom } =
      await queryMyLiquidity({
        context,
        swap: swap_info,
        address,
      })

    const total_lp_amount = convertMicroDenomToDenom(swap_info.lp_token_supply, POOL_TOKENS_DECIMALS)
    const provided_lp_amount = convertMicroDenomToDenom(provided_lp_in_micro_denom, POOL_TOKENS_DECIMALS)
    const base_reserve = convertMicroDenomToDenom(swap_info.base_reserve, POOL_TOKENS_DECIMALS)
    const quote_reserve = convertMicroDenomToDenom(swap_info.quote_reserve, POOL_TOKENS_DECIMALS)
    const total_liquidity_in_usd = 2 * (base_reserve * base_token_price_in_usd);
    const lp_ratio = protectAgainstNaN(provided_lp_amount / total_lp_amount);
    const provided_liquidity_in_usd = lp_ratio * total_liquidity_in_usd;

    const liquidity: PoolLiquidityState = {
      total_lp_amount,
      provided_lp_amount,
      base_reserve,
      quote_reserve,
      total_liquidity_in_usd,
      provided_liquidity_in_usd,
      base_token_price_in_usd,
    }

    return {
      ...pool,
      liquidity,
    }
  }

  return useQueries(
    (pools ?? []).map((pool) => ({
      queryKey: `@pool-liquidity/${pool.pool_id}/${address}`,
      enabled: Boolean(enabledGetTokenDollarValue && pool.pool_id),
      refetchOnMount: false as const,
      refetchInterval: refetchInBackground
        ? DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL
        : undefined,
      refetchIntervalInBackground: refetchInBackground,

      async queryFn() {
        return await queryPoolLiquidity(pool)
      },
    }))
  )
}

export const useQueryPoolLiquidity = ({ poolId }) => {
  const { data: poolsListResponse, isLoading: loadingPoolsList } =
    usePoolsListQuery()

  const poolToFetch = useMemo(() => {
    const pool = poolsListResponse?.poolsById[poolId]
    return pool ? [pool] : undefined
  }, [poolId, poolsListResponse])

  const [poolResponse] = useQueryMultiplePoolsLiquidity({
    pools: poolToFetch,
    refetchInBackground: true,
  })

  const persistedData = usePersistance(poolResponse?.data)

  return [
    persistedData,
    poolResponse?.isLoading || loadingPoolsList,
    poolResponse?.isError,
  ] as const
}

