import { useQuery } from 'react-query'

import { tokenDollarValueQuery } from '../queries/tokenDollarValueQuery'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../util/constants'
import {
  useBaseTokenInfo,
  useTokenInfo
} from './useTokenInfo'

export const useBaseTokenDollarValue = () => {
  const { symbol: base_token_symbol } = useBaseTokenInfo() || {}
  const [token_price_in_usd, fetching] =
    useTokenDollarValueQuery(base_token_symbol)

  return [token_price_in_usd, fetching] as const
}

export const useTokenDollarValueQuery = (symbol: string) => {
  const tokenInfo = useTokenInfo(symbol)

  const { data, isLoading } = useQuery(
    `tokenDollarValue/${symbol}`,
    async (): Promise<number> => {
      return tokenDollarValueQuery(tokenInfo.id)
    },
    {
      enabled: Boolean(tokenInfo?.id),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return [data || 0, isLoading] as const
}
