import { useTokenList } from 'hooks/useTokenList'
import { styled, useMedia, usePersistance } from 'junoblocks'
import { useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  TransactionStatus,
  transactionStatusState,
} from 'state/atoms/transactionAtoms'

import { useTokenToTokenPrice } from '../hooks'
import { tokenSwapAtom } from '../swapAtoms'
import { TokenSelector } from './TokenSelector'
import { ContractDetails } from './ContractDetails'
import { TransactionAction } from './TransactionAction'
import { TransactionTips } from './TransactionTips'


export const CreateTokenModule = () => {
  /* connect to recoil */
  const transactionStatus = useRecoilValue(transactionStatusState)
  const isUiDisabled =
    transactionStatus === TransactionStatus.EXECUTING
  const uiSize = useMedia('sm') ? 'small' : 'large'

  return (
    <>
      <StyledDivForWrapper>
        <ContractDetails
          name={"A"}
          symbol={"B"}
          decimals={6}
          initial_balances={[]}
          
        />
        
        
      </StyledDivForWrapper>
      <TransactionAction
        // isPriceLoading={isPriceLoading}
        // tokenToTokenPrice={tokenPrice}
        size={uiSize}
      />
    </>
  )
}

const StyledDivForWrapper = styled('div', {
  borderRadius: '8px',
  backgroundColor: '$colors$dark10',
})
