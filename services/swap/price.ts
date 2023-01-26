import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

export type InfoResponse = {
  base_reserve: string,
  base_denom: any,
  quote_reserve: string
  quote_denom: any,
  lp_token_supply: string,
  lp_token_address: string
}

export const getSwapInfo = async (
  swapAddress: string,
  client: CosmWasmClient
): Promise<InfoResponse> => {
  try {
    if (!swapAddress || !client) {
      throw new Error(
        `No swapAddress or rpcEndpoint was provided: ${JSON.stringify({
          swapAddress,
          client,
        })}`
      )
    }

    return await client.queryContractSmart(swapAddress, {
      info: {},
    })
  } catch (e) {
    console.error('Cannot get swap info:', e)
  }
}
