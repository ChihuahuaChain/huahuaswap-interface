import { JsonObject } from '@cosmjs/cosmwasm-stargate'
import { useConnectWallet } from 'hooks/useConnectWallet'
import { Button, Inline, Spinner, styled, Text } from 'junoblocks'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import { useInstantiate } from '../hooks'

type TransactionTipsProps = {
  msg: JsonObject
  entries: any
  disabled: boolean
}

export const TransactionAction = ({
  msg,
  entries,
  disabled  
}: TransactionTipsProps) => {
  const [requestedInstantiate, setRequestedInstantiate] = useState(false)
  // const { balance: tokenABalance } = useTokenBalance(tokenA?.tokenSymbol)

  // /* wallet state */
  const { status } = useRecoilValue(walletState)
  const { mutate: connectWallet } = useConnectWallet()
  
  let list = []
  for (let i = 0; i < entries.length; i ++)
    list.push(entries[i][1])

  msg.initial_balances = list

  const { mutate: handleInstantiate, isLoading: isExecutingTransaction } = 
    useInstantiate({
      msg
    })
  
  // /* proceed with the swap only if the price is loaded */

  useEffect(() => {
    const shouldTriggerTransaction = !isExecutingTransaction && requestedInstantiate
    if (shouldTriggerTransaction) {
      handleInstantiate()
      setRequestedInstantiate(false)
    }
  }, [isExecutingTransaction, requestedInstantiate, handleInstantiate])

  const shouldDisableSubmissionButton =
    isExecutingTransaction 

  const handleInstantiateButtonClick = () => {
    if (status === WalletStatusType.connected) {
      return setRequestedInstantiate(true)
    }

    connectWallet(null)
  }

  return (
    <>
    <StyledDivForWrapper>
      
      <Button
        variant="primary"
        disabled={disabled}
        onClick={!isExecutingTransaction
          ? handleInstantiateButtonClick
          : undefined
        }
      >
        {isExecutingTransaction ? <Spinner instant /> : 'Instantiate'}
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
