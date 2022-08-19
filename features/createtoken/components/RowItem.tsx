import {
  Button,
  IconWrapper,
  Inline,
  styled,
  Text,
  Union,
  useOnClickOutside,
} from 'junoblocks'
import React, { useRef, useState } from 'react'

import { RowInput } from './RowInput'

type RowItemProps = {
  readOnly?: boolean
  disabled?: boolean
  label: string
  inputValue?: string
  doubleRow?: boolean
  placeholder: string
  isNumber: boolean
  onChange: (label, inputValue) => void
}

export const RowItem = ({
  readOnly,
  placeholder,
  disabled,
  inputValue,
  doubleRow,
  label,
  isNumber,
  onChange,
}: RowItemProps) => {
  const wrapperRef = useRef<HTMLDivElement>()
  const inputRef = useRef<HTMLInputElement>()

  const [isInputFocused, setInputFocused] = useState(false)
  const handleInputChange = (inputValue) => onChange(label, inputValue)

  return (
    <StyledDivForContainer selected={isInputFocused} ref={wrapperRef}>
      <StyledDivForWrapper>
        <StyledDivForSelector>
          <Text variant="primary">{label}</Text>
        </StyledDivForSelector>

        <StyledDivForAmountWrapper>
          <RowInput
            placeholder={placeholder}
            isNumber={isNumber}
            inputRef={inputRef}
            inputValue={inputValue}
            disabled={!label || readOnly || disabled}
            onInputValueChange={handleInputChange}
            onFocus={() => {
              setInputFocused(true)
            }}
            onBlur={() => {
              setInputFocused(false)
            }}
          />
        </StyledDivForAmountWrapper>
      </StyledDivForWrapper>
    </StyledDivForContainer>
  )
}

const StyledDivForWrapper = styled('div', {
  padding: '$5 $5 $5 $7',
  display: `flex flex-column`,
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
  justifyContent: 'right',
  position: 'left',
  zIndex: 1,

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
  boxShadow: '0 0 0 $space$1 $colors$dark0',
  variants: {
    selected: selectedVariantForInputWrapper,
  },
})
