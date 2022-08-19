import { JsonObject } from '@cosmjs/cosmwasm'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { coin } from '@cosmjs/stargate'

// import { TokenInfo } from '../../queries/usePoolsListQuery'
// import {
//   createExecuteMessage,
//   createIncreaseAllowanceMessage,
//   validateTransactionSuccess,
// } from '../../util/messages'

type instantiatecw20Args = {
  // name: string
  // symbol: string
  // decimals: number
  // initial_balances: []
  // mint: {
  //   minter: string
  //   cap: any
  // }
  // marketing: {
  //   project: string
  //   description: string
  //   marketing: string
  //   logo: {
  //     url: string
  //   }
  // }
  msg: JsonObject
  senderAddress: string
  client: SigningCosmWasmClient
}

export const instantiatecw20 = async ({
  msg,
  senderAddress,
  client,
}: instantiatecw20Args) => {

  return await client.instantiate(
    senderAddress,
    18,
    msg,
    'label',
    'auto'
  )
}
