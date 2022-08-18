import {
  calculateCharactersLength,
  styled,
  Text,
  useAmountChangeController,
} from 'junoblocks'
import React, { HTMLProps, Ref, useState } from 'react'

type SelectorInputProps = {
  isNumber: boolean
  inputValue: string
  disabled: boolean
  onInputValueChange: (value: String) => void
  inputRef?: Ref<HTMLInputElement>
} & Omit<HTMLProps<HTMLInputElement>, 'ref'>

export const SelectorInput = ({
  isNumber,
  inputValue,
  disabled,
  onInputValueChange,
  inputRef,
  ...inputProps
}: SelectorInputProps) => {
  
  const [value, setValue] = useState('')
  return (
    <Text variant="primary">
      <StyledInput

        ref={inputRef}
        type={isNumber ? "number": "text"}
        lang="en-US"
        placeholder="0.0"
        min={0}
        value={inputValue}
        onChange={({ target: { value } }) => onInputValueChange(value)}

        autoComplete="off"
        readOnly={disabled}
        {...inputProps}
      />
    </Text>
  )
}

const StyledInput = styled('input', {
  width: 'auto',
  textAlign: 'right',
  color: 'inherit',
})
