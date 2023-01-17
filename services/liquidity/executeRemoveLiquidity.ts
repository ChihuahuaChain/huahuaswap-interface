import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import {
  createExecuteMessage,
  createIncreaseAllowanceMessage,
  validateTransactionSuccess,
} from 'util/messages'

type ExecuteRemoveLiquidityArgs = {
  lp_amount_to_remove: number,
  min_base_token_output: number,
  min_quote_token_output: number,
  swap_address: string,
  sender_address: string,
  lp_token_address: string,
  client: SigningCosmWasmClient
}

export const executeRemoveLiquidity = async ({
  lp_amount_to_remove,
  min_base_token_output,
  min_quote_token_output,
  swap_address,
  sender_address,
  lp_token_address,
  client,
}: ExecuteRemoveLiquidityArgs) => {
  const increaseAllowanceMessage = createIncreaseAllowanceMessage({
    tokenAmount: lp_amount_to_remove,
    senderAddress: sender_address,
    tokenAddress: lp_token_address,
    swapAddress: swap_address,
  })

  const executeMessage = createExecuteMessage({
    senderAddress: sender_address,
    contractAddress: swap_address,
    message: {
      remove_liquidity: {
        amount: `${lp_amount_to_remove}`,
        min_base_token_output: `${min_base_token_output}`,
        min_quote_token_output: `${min_quote_token_output}`,
      },
    },
  })

  return validateTransactionSuccess(
    await client.signAndBroadcast(
      sender_address,
      [increaseAllowanceMessage, executeMessage],
      'auto'
    )
  )
}
