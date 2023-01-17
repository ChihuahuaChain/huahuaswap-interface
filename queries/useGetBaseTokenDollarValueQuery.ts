import { useCosmWasmClient } from '../hooks/useCosmWasmClient'
import { useBaseTokenDollarValue } from '../hooks/useBaseTokenDollarValue'
import { useBaseTokenInfo } from '../hooks/useTokenInfo'

export const useGetBaseTokenDollarValueQuery = () => {
  const client = useCosmWasmClient()
  const base_token = useBaseTokenInfo()
  const [base_token_price_in_usd, fetching_base_token_price] = useBaseTokenDollarValue()

  return [
    async function get_base_token_dollar_value() {
      return base_token_price_in_usd
    },
    Boolean(
      base_token && base_token_price_in_usd && client && !fetching_base_token_price
    ),
  ] as const
}
