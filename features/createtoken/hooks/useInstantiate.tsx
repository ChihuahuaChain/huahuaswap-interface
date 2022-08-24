import { JsonObject } from '@cosmjs/cosmwasm-stargate'
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
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { instantiatecw20 } from '../../../services/instantiatecw20'
import {
  TransactionStatus,
  transactionStatusState,
  instantiateStatusState
} from 'state/atoms/transactionAtoms'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import { convertDenomToMicroDenom } from 'util/conversion'

type UseInstantiateArgs = {
  msg: JsonObject
  
}

export const useInstantiate = ({
  msg
}: UseInstantiateArgs) => {
  const { client, address, status } = useRecoilValue(walletState)
  const setTransactionState = useSetRecoilState(transactionStatusState)
  const setInstantiateState = useSetRecoilState(instantiateStatusState)

  return useMutation(
    'instantiatecw20',
    async () => {
      if (status !== WalletStatusType.connected) {
        throw new Error('Please connect your wallet.')
      }

      setTransactionState(TransactionStatus.EXECUTING)
    
      return await instantiatecw20({
        msg,
        senderAddress: address,
        client,
      })
    },
    {
      onSuccess(data) {
        // console.log(data)
        //data.contractAddress
        //data.transactionHash
        setInstantiateState(data)
        toast.custom((t) => (
          <Toast
            icon={<IconWrapper icon={<Valid />} color="valid" />}
            title={data.contractAddress}
            buttons={
              <Button
                as="a"
                variant="ghost"
                href={process.env.NEXT_PUBLIC_BLOCK_EXPLORER + data.transactionHash}
                target="__blank"
                iconRight={<UpRightArrow />}
              >
                Transaction Hash
              </Button>
            }
            onClose={() => toast.dismiss(t.id)}
          />
        ))
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
            title="Oops instantiate error!"
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
