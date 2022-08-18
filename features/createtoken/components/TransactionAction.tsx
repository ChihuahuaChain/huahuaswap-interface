import { JsonObject } from '@cosmjs/cosmwasm-stargate'
import { useConnectWallet } from 'hooks/useConnectWallet'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { Button, Inline, Spinner, styled, Text } from 'junoblocks'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import { NETWORK_FEE } from 'util/constants'

import { useInstantiate } from '../hooks'
import { SlippageSelector } from './SlippageSelector'

type TransactionTipsProps = {
  msg: JsonObject
  disabled: boolean
}

export const TransactionAction = ({
  msg,
  disabled  
}: TransactionTipsProps) => {
  const [requestedInstantiate, setRequestedInstantiate] = useState(false)
  // const { balance: tokenABalance } = useTokenBalance(tokenA?.tokenSymbol)

  // /* wallet state */
  const { status } = useRecoilValue(walletState)
  const { mutate: connectWallet } = useConnectWallet()

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
