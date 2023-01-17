import {
  Button,
  ErrorIcon,
  IconWrapper,
  Toast,
  UpRightArrow,
  Valid,
} from 'junoblocks'
import { toast } from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  TransactionStatus,
  transactionStatusState,
} from 'state/atoms/transactionAtoms'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import { directTokenSwap, passThroughTokenSwap } from 'services/swap'
import { convertDenomToMicroDenom } from 'util/conversion'

import { useRefetchQueries } from '../../../hooks/useRefetchQueries'
import { tokenSwapAtom } from '../swapAtoms'
import { POOL_TOKENS_DECIMALS } from '../../../util/constants'
import { useBaseTokenInfo, useTokenInfo } from '../../../hooks/useTokenInfo'

export const useTokenSwap = () => {
  const { client, address, status } = useRecoilValue(walletState)
  const setTransactionState = useSetRecoilState(transactionStatusState)
  const [{ input_token, output_token }, setTokenSwapState] = useRecoilState(tokenSwapAtom)
  const refetchQueries = useRefetchQueries(['tokenBalance'])
  const base_token_info = useBaseTokenInfo()
  const input_token_info = useTokenInfo(input_token.symbol)

  return useMutation(
    'swapTokens',
    async () => {
      if (status !== WalletStatusType.connected) {
        throw new Error('Please connect your wallet.')
      }

      setTransactionState(TransactionStatus.EXECUTING)

      if (Boolean(input_token.swap_address) && !Boolean(output_token.swap_address)) {
        return await directTokenSwap({
          input_token: {
            ...input_token,
            amount: convertDenomToMicroDenom(input_token.amount, POOL_TOKENS_DECIMALS)
          },
          output_token: {
            ...output_token,
            amount: convertDenomToMicroDenom(output_token.amount, POOL_TOKENS_DECIMALS)
          },
          sender_address: address,
          client,
          base_token_info,
          input_token_info
        })
      } else {
        /*return await passThroughTokenSwap({
          tokenAmount,
          price,
          slippage,
          senderAddress: address,
          tokenA,
          swapAddress: baseTokenAPool.swap_address,
          outputSwapAddress: baseTokenBPool.swap_address,
          client,
        })*/
      }
    },
    {
      onSuccess() {
        toast.custom((t) => (
          <Toast
            icon={<IconWrapper icon={<Valid />} color="valid" />}
            title="Swap successful!"
            onClose={() => toast.dismiss(t.id)}
          />
        ))

        setTokenSwapState({
          input_token: {
            ...input_token,
            amount: 0,
          },
          output_token: {
            ...output_token,
            amount: 0,
          },
        })

        refetchQueries()
      },
      onError(e) {
        const errorMessage =
          String(e).length > 300
            ? `${String(e).substring(0, 150)} ... ${String(e).substring(
              String(e).length - 150
            )}`
            : String(e)

        toast.custom((t) => (
          <Toast
            icon={<ErrorIcon color="error" />}
            title="Oops swap error!"
            body={errorMessage}
            buttons={
              <Button
                as="a"
                variant="ghost"
                href={process.env.NEXT_PUBLIC_FEEDBACK_LINK}
                target="__blank"
                iconRight={<UpRightArrow />}
              >
                Provide feedback
              </Button>
            }
            onClose={() => toast.dismiss(t.id)}
          />
        ))
      },
      onSettled() {
        setTransactionState(TransactionStatus.IDLE)
      },
    }
  )
}
