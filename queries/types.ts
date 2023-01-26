import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

import { useGetBaseTokenDollarValueQuery } from './useGetBaseTokenDollarValueQuery'

export type InternalQueryContext = {
  client: CosmWasmClient
  getTokenDollarValue: ReturnType<typeof useGetBaseTokenDollarValueQuery>[0]
}
