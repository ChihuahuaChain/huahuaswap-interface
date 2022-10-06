import { JsonObject } from '@cosmjs/cosmwasm'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { coin } from '@cosmjs/stargate'

type createCW20TokenArgs = {
  msg: JsonObject
  senderAddress: string
  client: SigningCosmWasmClient
}

export const createCW20Token = async ({
  msg,
  senderAddress,
  client,
}: createCW20TokenArgs) => {
  // Here we pass the token creation fee
  const funds = [
    coin(
      process.env.NEXT_PUBLIC_TOKEN_CREATION_FEE,
      process.env.NEXT_PUBLIC_NATIVE_DENOM
    ),
  ]

  return await client.execute(
    senderAddress,
    process.env.NEXT_PUBLIC_CW20_TOKEN_MANAGER,
    msg,
    'auto',
    undefined,
    funds
  )
}
