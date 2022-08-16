import { useTokenBalance } from 'hooks/useTokenBalance'
import {
  Button,
  IconWrapper,
  Inline,
  styled,
  Union,
  useOnClickOutside,
} from 'junoblocks'
import React, { useRef, useState } from 'react'

import { ConvenienceBalanceButtons } from './ConvenienceBalanceButtons'
import { QueryInput } from './QueryInput'
import { SelectorInput } from './SelectorInput'
import { TextInput } from './TextInput'
import { SelectorToggle } from './SelectorToggle'
import { TokenOptionsList } from './TokenOptionsList'

type ContractDetailsProps = {
  name: string
  symbol: string
  decimals: number
  initial_balances: any
  disabled: boolean
}

export const ContractDetails = ({
  name,
  symbol,
  decimals,
  initial_balances,
  disabled
}: ContractDetailsProps) => {
  const wrapperRef = useRef<HTMLDivElement>()
  const inputRef = useRef<HTMLInputElement>()

  
  // const { balance: availableAmount } = useTokenBalance(tokenSymbol)
  // const [tokenSearchQuery, setTokenSearchQuery] = useState('')
  

  

  // const handleAmountChange = (amount) => onChange({ tokenSymbol, amount })
  // const handleSelectToken = (selectedTokenSymbol) => {
  //   onChange({ tokenSymbol: selectedTokenSymbol, amount })
  //   setTokenListShowing(false)
  // }

  // useOnClickOutside([wrapperRef], () => {
  //   setTokenListShowing(false)
  // })


  
  return (
    <StyledDivForContainer
      ref={wrapperRef}
    >
      <StyledDivForWrapper>

        <StyledDivForAmountWrapper>
          <TextInput
            inputRef={inputRef}
            string={name}
            disabled={false}
            
          />
        </StyledDivForAmountWrapper>
        
      </StyledDivForWrapper>
      
    </StyledDivForContainer>
  )
}

const StyledDivForWrapper = styled('div', {
  padding: '$5 $15 $5 $7',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  zIndex: 0,
})

const StyledDivForSelector = styled('div', {
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  zIndex: 1,
})

const StyledDivForAmountWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'relative',
  zIndex: 1,
})

const StyledDivForOverlay = styled('div', {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  backgroundColor: '$colors$dark0',
  transition: 'background-color .1s ease-out',
  variants: {
    interactive: {
      true: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '$colors$dark5',
        },
      },
    },
  },
})

const selectedVariantForInputWrapper = {
  true: {
    boxShadow: '0 0 0 $space$1 $borderColors$selected',
  },
  false: {
    boxShadow: '0 0 0 $space$1 $colors$dark0',
  },
}

const StyledDivForContainer = styled('div', {
  borderRadius: '$2',
  transition: 'box-shadow .1s ease-out',
  variants: {
    selected: selectedVariantForInputWrapper,
  },
})

const StyledInlineForInputWrapper = styled('div', {
  borderRadius: '$2',
  transition: 'box-shadow .1s ease-out',
  display: 'flex',
  alignItems: 'center',

  variants: {
    selected: selectedVariantForInputWrapper,

    rendersButtons: {
      true: {
        justifyContent: 'space-between',
        padding: '$10 $12',
      },
      false: {
        justifyContent: 'flex-end',
        padding: '$13 $12',
      },
    },
  },
})
