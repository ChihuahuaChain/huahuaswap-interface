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
        {/* <ContractDetails
          name={"A"}
          symbol={"B"}
          decimals={6}
          initial_balances={[]}
          
        /> */}

        <RowItem
          label={"tokenA.tokenSymbol"}
          // inputValue={100}
          onChange={(label, inputValue) => {
            // setTokenSwapState([updateTokenA, tokenB])
            console.log(inputValue)
          }}
          disabled={isUiDisabled}
          size={uiSize}
        />
        {/* <CategoryInput
            // inputRef={inputRef}
            label={"ddd"}
            value={"false"}
            
          /> */}
        
        
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
