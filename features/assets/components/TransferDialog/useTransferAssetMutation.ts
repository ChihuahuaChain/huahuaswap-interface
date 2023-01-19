import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import {
  Coin,
  DeliverTxResponse,
  MsgTransferEncodeObject,
} from '@cosmjs/stargate'
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx'
import { Height } from 'cosmjs-types/ibc/core/client/v1/client'
import { IBCAssetInfo } from 'hooks/useIbcAssetList'
import Long from 'long'
import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'
import { ibcWalletState, walletState } from 'state/atoms/walletAtoms'
import { convertDenomToMicroDenom } from 'util/conversion'

import { TransactionKind } from './types'

type UseTransferAssetMutationArgs = {
  transactionKind: TransactionKind
  tokenAmount: number
  tokenInfo: IBCAssetInfo
} & Parameters<typeof useMutation>[2]

const sendIbcTokens = (
  senderAddress: string,
  recipientAddress: string,
  transferAmount: Coin,
  sourcePort: string,
  sourceChannel: string,
  timeoutHeight: Height | undefined,
  /** timeout in seconds */
  timeoutTimestamp: number | undefined,
  memo = '',
  client: SigningCosmWasmClient
): Promise<DeliverTxResponse> => {
  const timeoutTimestampNanoseconds = timeoutTimestamp
    ? Long.fromNumber(timeoutTimestamp).multiply(1_000_000_000)
    : undefined
  const transferMsg: MsgTransferEncodeObject = {
    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
    value: MsgTransfer.fromPartial({
      sourcePort: sourcePort,
      sourceChannel: sourceChannel,
      sender: senderAddress,
      receiver: recipientAddress,
      token: transferAmount,
      timeoutHeight: timeoutHeight,
      timeoutTimestamp: timeoutTimestampNanoseconds,
    }),
  }
  return client.signAndBroadcast(
    senderAddress,
    [transferMsg],
    // TODO get gas amount for ibc transfers from config
    {
      amount: [
        {
          denom: 'uhuahua',
          amount: "1106650"
        }
      ],
      gas: "1106650"
    },
    memo
  )
}

export const useTransferAssetMutation = ({
  transactionKind,
  tokenAmount,
  tokenInfo,
  ...mutationArgs
}: UseTransferAssetMutationArgs) => {
  const { address, client } = useRecoilValue(walletState)
  const { address: ibcAddress, client: ibcClient } =
    useRecoilValue(ibcWalletState)

  return useMutation(async () => {
    const timeout = Math.floor(new Date().getTime() / 1000) + 600

    if (transactionKind == 'deposit') {
      return await ibcClient.sendIbcTokens(
        ibcAddress,
        address,
        {
          amount: convertDenomToMicroDenom(
            tokenAmount,
            tokenInfo.decimals
          ).toString(),
          denom: tokenInfo.denom,
        },
        'transfer',
        tokenInfo.channel,
        undefined,
        timeout,
        // TODO get gas amount for ibc transfers from config
        {
          amount: [
            {
              denom: tokenInfo.denom,
              amount: "1106650"
            }
          ],
          gas: "1106650"
        }
      )
    }

    if (transactionKind == 'withdraw') {
      return await sendIbcTokens(
        address,
        ibcAddress,
        {
          amount: convertDenomToMicroDenom(
            tokenAmount,
            tokenInfo.decimals
          ).toString(),
          denom: tokenInfo.chihuahua_denom,
        },
        'transfer',
        tokenInfo.chihuahua_channel,
        undefined,
        timeout,
        '',
        client
      )
    }
  }, mutationArgs)
}
