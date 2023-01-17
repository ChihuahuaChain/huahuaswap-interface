import { queryLiquidityBalance } from '../services/liquidity'

export async function queryMyLiquidity({ swap, address, context: { client } }) {
  const provided_lp_in_micro_denom = address
    ? await queryLiquidityBalance({
      tokenAddress: swap.lp_token_address,
      client,
      address,
    })
    : 0

  return { provided_lp_in_micro_denom }
}
