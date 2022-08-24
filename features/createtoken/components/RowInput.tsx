import {
  calculateCharactersLength,
  styled,
  Text,
} from 'junoblocks'
import React, { HTMLProps, Ref, useState } from 'react'

type RowInputProps = {
  isNumber: boolean
  disabled: boolean
  inputValue: string
  onInputValueChange: (value: String) => void
  inputRef?: Ref<HTMLInputElement>
  placeholder
  rowType: number
} & Omit<HTMLProps<HTMLInputElement>, 'ref'>

export const RowInput = ({
  isNumber,
  disabled,
  inputValue,
  onInputValueChange,
  inputRef,
  placeholder,
  rowType,
  ...inputProps
}: RowInputProps) => {
  
  const [value, setValue] = useState(inputValue)

  let min = 850
  let max = 850
  if (rowType == 1) {
    min = 400
    max = 400  
  } else if (rowType == 2) {
    min = 300
    max = 300  
  }
  return (
    <Text variant="primary">
      <StyledInput

        ref={inputRef}
        type={isNumber ? "number": "text"}
        lang="en-US"
        placeholder={placeholder}
        min={0}
        value={value}
        onChange={({ target: { value } }) => {onInputValueChange(value); setValue(value);}}
        autoComplete="off"
        readOnly={disabled}
        style={{ minWidth: `${min}px`, maxWidth: `${max}px`, width: value ? `${calculateCharactersLength(value)}ch` : `20ch`}}
        
        {...inputProps}
      />
    </Text>
  )
}

const StyledInput = styled('input', {
  
  padding: '$5 $5 $2 $1',
  textAlign: 'left',
  color: 'inherit',
})
