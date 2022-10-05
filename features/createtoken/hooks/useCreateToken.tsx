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
import { createCW20Token } from '../../../services/createCW20Token'
import {
  TransactionStatus,
  transactionStatusState,
  createTokenStatusState,
} from 'state/atoms/transactionAtoms'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'

type useCreateTokenArgs = {
  info: JsonObject
}

export const useCreateToken = ({
  info
}: useCreateTokenArgs) => {
  const { client, address, status } = useRecoilValue(walletState)
  const setTransactionState = useSetRecoilState(transactionStatusState)
  const setCreateTokenState = useSetRecoilState(createTokenStatusState)

  return useMutation(
    'createCW20Token ',
    async () => {
      if (status !== WalletStatusType.connected) {
        throw new Error('Please connect your wallet.')
      }

      setTransactionState(TransactionStatus.EXECUTING)
      return await createCW20Token({
        msg: {
          create_token: {
            token_info: info
          }
        },
        senderAddress: address,
        client,
      })
    },
    {
      onSuccess(res) {
        // filter to extract the contract address from the data
        let events = res.logs[0].events;
        let instatiateEvent = events.find((e: any) => e.type == 'instantiate');
        let attrs = instatiateEvent.attributes;

        const contractAddress: String = attrs.find((e: any) => e.key == '_contract_address').value
        const transactionHash = res.transactionHash;

        setCreateTokenState({
          transactionHash,
          contractAddress,
          info
        })

        toast.custom((t) => (
          <Toast
            icon={<IconWrapper icon={<Valid />} color="valid" />}
            title={'Token created successfully'}
            buttons={
              <Button
                as="a"
                variant="ghost"
                href={process.env.NEXT_PUBLIC_BLOCK_EXPLORER + transactionHash}
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
        console.log(e);

        const errorMessage =
          String(e).length > 300
            ? `${String(e).substring(0, 150)} ... ${String(e).substring(
              String(e).length - 150
            )}`
            : String(e)

        toast.custom((t) => (
          <Toast
            icon={<ErrorIcon color="error" />}
            title="Oops token creation error!"
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
