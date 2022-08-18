import {
  calculateCharactersLength,
  styled,
  Text,
  useAmountChangeController,
} from 'junoblocks'
import React, { HTMLProps, Ref, useState } from 'react'

type RowInputProps = {
  isNumber: boolean
  disabled: boolean
  onInputValueChange: (value: String) => void
  inputRef?: Ref<HTMLInputElement>
  placeholder
} & Omit<HTMLProps<HTMLInputElement>, 'ref'>

export const RowInput = ({
  isNumber,
  disabled,
  onInputValueChange,
  inputRef,
  placeholder,
  ...inputProps
}: RowInputProps) => {
  
  const [value, setValue] = useState('')
  return (
    <Text variant="primary">
      <StyledInput

        ref={inputRef}
        type={isNumber ? "number": "text"}
        lang="en-US"
        placeholder={placeholder}
        min={0}
        onChange={({ target: { value } }) => onInputValueChange(value)}

        autoComplete="off"
        readOnly={disabled}
        
        {...inputProps}
      />
    </Text>
  )
}

const StyledInput = styled('input', {
  minWidth:"400px",
  textAlign: 'left',
  color: 'inherit',
})
