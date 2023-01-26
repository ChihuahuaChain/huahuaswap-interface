import {
  MsgExecuteContractEncodeObject,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { coin } from '@cosmjs/stargate'

import { TokenInfo } from '../../queries/usePoolsListQuery'
import {
  createExecuteMessage,
  createIncreaseAllowanceMessage,
  validateTransactionSuccess,
} from '../../util/messages'

type ExecuteAddLiquidityArgs = {
  base_token_info: TokenInfo
  quote_token_info: TokenInfo
  base_amount_to_add: number
  quote_amount_to_add: number
  swap_address: string
  sender_address: string
  client: SigningCosmWasmClient
}

export const executeAddLiquidity = async ({
  base_token_info,
  quote_token_info,
  base_amount_to_add,
  quote_amount_to_add,
  swap_address,
  sender_address,
  client,
}: ExecuteAddLiquidityArgs): Promise<any> => {
  const add_liquidity_message = {
    add_liquidity: {
      base_token_amount: `${base_amount_to_add}`,
      max_quote_token_amount: `${quote_amount_to_add}`,
    },
  }

  if (!quote_token_info.native) {
    const increase_allowance_message: MsgExecuteContractEncodeObject = createIncreaseAllowanceMessage({
      tokenAmount: quote_amount_to_add,
      tokenAddress: quote_token_info.token_address,
      senderAddress: sender_address,
      swapAddress: swap_address,
    })

    const execute_add_liquidity_message = createExecuteMessage({
      message: add_liquidity_message,
      senderAddress: sender_address,
      contractAddress: swap_address,
      funds: [
        coin(base_amount_to_add, base_token_info.denom),
      ],
    })

    return validateTransactionSuccess(
      await client.signAndBroadcast(
        sender_address,
        [increase_allowance_message, execute_add_liquidity_message],
        'auto'
      )
    )
  } else {
    const funds = [
      coin(base_amount_to_add, base_token_info.denom),
      coin(quote_amount_to_add, quote_token_info.denom),
    ].sort((a, b) => (a.denom > b.denom ? 1 : -1))

    return await client.execute(
      sender_address,
      swap_address,
      add_liquidity_message,
      'auto',
      undefined,
      funds
    )
  }
}
