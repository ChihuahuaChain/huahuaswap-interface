import { getSwapInfo } from '../services/swap'

export async function querySwapInfo({ context: { client }, swap_address }) {
  const swap = await getSwapInfo(swap_address, client)

  return {
    ...swap,
    swap_address,
    base_reserve: Number(swap.base_reserve),
    quote_reserve: Number(swap.quote_reserve),
    lp_token_supply: Number(swap.lp_token_supply),
  }
}
