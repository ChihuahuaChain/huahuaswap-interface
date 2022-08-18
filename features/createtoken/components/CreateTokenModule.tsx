import { useTokenList } from 'hooks/useTokenList'
import { styled, useMedia, usePersistance } from 'junoblocks'
import { useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  TransactionStatus,
  transactionStatusState,
} from 'state/atoms/transactionAtoms'
import { TextInput } from './TextInput'

import { useTokenToTokenPrice } from '../hooks'
import { RowItem } from './RowItem'
import { ContractDetails } from './ContractDetails'
import { TransactionAction } from './TransactionAction'
import { TransactionTips } from './TransactionTips'
import { CategoryInput } from './CategoryInput'

export const CreateTokenModule = () => {
  /* connect to recoil */
  const transactionStatus = useRecoilValue(transactionStatusState)
  const isUiDisabled =
    transactionStatus === TransactionStatus.EXECUTING
  const uiSize = useMedia('sm') ? 'small' : 'large'

  return (
    <>
      <StyledDivForWrapper>
        <RowItem
          label={"tokenA.tokenSymbol"}
          // inputValue={100}
          isNumber={true}
          onChange={(label, inputValue) => {
            // setTokenSwapState([updateTokenA, tokenB])
            console.log(label + ":" + inputValue)
          }}
          disabled={isUiDisabled}
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
