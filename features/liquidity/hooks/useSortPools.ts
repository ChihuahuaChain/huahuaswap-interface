import { PoolEntityTypeWithLiquidity } from 'queries/useQueryPools'
import { useMemo } from 'react'

export type SortParameters = 'liquidity' | 'rewards' | 'alphabetical'
export type SortDirections = 'asc' | 'desc'

type UseSortPoolsArgs = {
  pools?: Array<PoolEntityTypeWithLiquidity>
  filter?: {
    tokenSymbol: string
  }
  sortBy?: {
    parameter: SortParameters
    direction: SortDirections
  }
}

export const useSortPools = ({ pools, filter, sortBy }: UseSortPoolsArgs) => {
  return useMemo((): readonly [
    Array<PoolEntityTypeWithLiquidity>,
    Array<PoolEntityTypeWithLiquidity>
  ] => {
    const myPools = [] as Array<PoolEntityTypeWithLiquidity>
    const otherPools = [] as Array<PoolEntityTypeWithLiquidity>

    if (!pools?.length) {
      return [myPools, otherPools]
    }

    /* split up liquidity in my liquidity pools and other pools buckets */
    pools.forEach((pool) => {
      const providedLiquidityAmount = pool.liquidity.provided_lp_amount
      const poolsBucket = providedLiquidityAmount > 0 ? myPools : otherPools

      poolsBucket.push(pool)
    })

    /* sort and filter pools */
    return [
      sortPools(filterPools(myPools, filter), sortBy),
      sortPools(filterPools(otherPools, filter), sortBy),
    ] as const
  }, [pools, filter, sortBy])
}

function sortPools(
  pools: Array<PoolEntityTypeWithLiquidity>,
  sortBy?: UseSortPoolsArgs['sortBy']
) {
  if (!sortBy) return pools
  const result = pools.sort((poolA, poolB) => {
    /* sort by total liquidity */
    if (sortBy.parameter === 'liquidity') {
      const poolATotalLiquidity = poolA.liquidity.total_lp_amount
      const poolBTotalLiquidity = poolB.liquidity.total_lp_amount

      if (poolATotalLiquidity > poolBTotalLiquidity) {
        return 1
      } else if (poolATotalLiquidity < poolBTotalLiquidity) {
        return -1
      }
    }

    /* sort by tokenB names */
    if (sortBy.parameter === 'alphabetical') {
      const poolATokenName = poolA.pool_assets.quote.symbol
      const poolBTokenName = poolB.pool_assets.quote.symbol

      if (poolATokenName > poolBTokenName) {
        return 1
      } else if (poolATokenName < poolBTokenName) {
        return -1
      }
    }

    return 0
  })

  if (sortBy.direction === 'desc') {
    return result.reverse()
  }

  return result
}

function filterPools(
  pools: Array<PoolEntityTypeWithLiquidity>,
  filter?: UseSortPoolsArgs['filter']
) {
  if (!filter || !filter.tokenSymbol) return pools
  return pools.filter(
    ({ pool_assets }) =>
      pool_assets.base.symbol === filter.tokenSymbol ||
      pool_assets.quote.symbol === filter.tokenSymbol
  )
}
