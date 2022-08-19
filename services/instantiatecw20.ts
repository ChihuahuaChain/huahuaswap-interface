import { JsonObject } from '@cosmjs/cosmwasm'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { coin } from '@cosmjs/stargate'

type instantiatecw20Args = {
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
    parseInt(process.env.NEXT_PUBLIC_CW20_CODE_ID),
    msg,
    msg.name,
    'auto'
  )
}
