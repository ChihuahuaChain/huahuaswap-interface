import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { coin } from '@cosmjs/stargate'

import { TokenInfo } from '../../queries/usePoolsListQuery'
import {
  createExecuteMessage,
  createIncreaseAllowanceMessage,
  validateTransactionSuccess,
} from '../../util/messages'

type PassThroughTokenSwapArgs = {
  input_token_info: TokenInfo
  quote_input_amount: number
  input_amm_address: string
  output_amm_address: string
  min_quote_output_amount: number
  client: SigningCosmWasmClient,
  sender_address: string
}

export const passThroughTokenSwap = async ({
  input_token_info,
  quote_input_amount,
  input_amm_address,
  output_amm_address,
  min_quote_output_amount,
  client,
  sender_address
}: PassThroughTokenSwapArgs): Promise<any> => {
  const swapMessage = {
    pass_through_swap: {
      quote_input_amount: `${quote_input_amount}`,
      min_quote_output_amount: `${min_quote_output_amount}`,
      output_amm_address
    },
  }

  if (!input_token_info.native) {
    const increaseAllowanceMessage = createIncreaseAllowanceMessage({
      senderAddress: sender_address,
      tokenAmount: quote_input_amount,
      tokenAddress: input_token_info.token_address,
      swapAddress: input_amm_address,
    })

    const executeMessage = createExecuteMessage({
      senderAddress: sender_address,
      contractAddress: input_amm_address,
      message: swapMessage,
    })

    return validateTransactionSuccess(
      await client.signAndBroadcast(
        sender_address,
        [increaseAllowanceMessage, executeMessage],
        'auto'
      )
    )
  }

  return await client.execute(
    sender_address,
    input_amm_address,
    swapMessage,
    'auto',
    undefined,
    [coin(quote_input_amount, input_token_info.denom)]
  )
}
