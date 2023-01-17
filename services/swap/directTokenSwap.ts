import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { coin } from '@cosmjs/stargate'
import { TokenItemState } from '../../features/swap/swapAtoms'
import {
  createExecuteMessage,
  createIncreaseAllowanceMessage,
  validateTransactionSuccess,
} from '../../util/messages'
import { useBaseTokenInfo, useTokenInfo } from 'hooks/useTokenInfo'
import { TokenInfo } from '../../queries/usePoolsListQuery'

type DirectTokenSwapArgs = {
  input_token: TokenItemState
  output_token: TokenItemState
  sender_address: string
  client: SigningCosmWasmClient,
  base_token_info: TokenInfo,
  input_token_info: TokenInfo
}

export const directTokenSwap = async ({
  input_token,
  output_token,
  sender_address,
  client,
  base_token_info,
  input_token_info
}: DirectTokenSwapArgs) => {
  const is_input_native = input_token_info.native;
  const is_input_base = base_token_info.symbol === input_token_info.symbol;

  const swapMessage = {
    swap: {
      input_token: is_input_base ? 'Base' : 'Quote',
      input_amount: `${input_token.amount}`,
      output_amount: `${output_token.amount}`,
    },
  }

  if (!is_input_native) {
    const increaseAllowanceMessage = createIncreaseAllowanceMessage({
      senderAddress: sender_address,
      tokenAmount: input_token.amount,
      tokenAddress: input_token_info.token_address,
      swapAddress: input_token.swap_address,
    })

    const executeMessage = createExecuteMessage({
      senderAddress: sender_address,
      contractAddress: input_token.swap_address,
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
    input_token.swap_address,
    swapMessage,
    'auto',
    undefined,
    [coin(input_token.amount, input_token_info.denom)]
  )
}
