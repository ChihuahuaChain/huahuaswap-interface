import { JsonObject } from '@cosmjs/cosmwasm-stargate'
import { useConnectWallet } from 'hooks/useConnectWallet'
import { Button, Spinner, styled } from 'junoblocks'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import { useCreateToken } from '../hooks'

type TransactionTipsProps = {
  msg: JsonObject
  entries: any
  disabled: boolean
}

export const TransactionAction = ({
  msg,
  entries,
  disabled,
}: TransactionTipsProps) => {
  const [requestedCreateToken, setRequestedCreateToken] = useState(false)

  // /* wallet state */
  const { status } = useRecoilValue(walletState)
  const { mutate: connectWallet } = useConnectWallet()

  let list = []
  for (let i = 0; i < entries.length; i++)
    list.push(entries[i][1])

  msg.initial_balances = list

  const { mutate: handleCreateToken, isLoading: isExecutingTransaction } =
    useCreateToken({
      info: msg
    });

  /* Here we proceed with creating a new token */
  useEffect(() => {
    const shouldTriggerTransaction = !isExecutingTransaction && requestedCreateToken;

    if (shouldTriggerTransaction) {
      handleCreateToken();
      setRequestedCreateToken(false);
    }
  },
    [isExecutingTransaction, requestedCreateToken, handleCreateToken]
  );

  const handleInstantiateButtonClick = () => {
    if (status === WalletStatusType.connected) {
      return setRequestedCreateToken(true)
    }

    connectWallet(null)
  }

  return (
    <>
      <StyledDivForWrapper>
        <Button
          variant="primary"
          size="large"
          disabled={disabled}
          onClick={!isExecutingTransaction
            ? handleInstantiateButtonClick
            : undefined
          }
        >
          {isExecutingTransaction ? <Spinner instant /> : 'Create Token'}
        </Button>
      </StyledDivForWrapper>
    </>
  )
}

const StyledDivForWrapper = styled('div', {
  display: 'flex',
  // gridTemplateColumns: '1fr 150px',
  columnGap: 12,
  alignItems: 'right',
  padding: '12px 0px 0px',
})
