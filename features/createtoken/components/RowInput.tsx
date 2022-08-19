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
} & Omit<HTMLProps<HTMLInputElement>, 'ref'>

export const RowInput = ({
  isNumber,
  disabled,
  inputValue,
  onInputValueChange,
  inputRef,
  placeholder,
  ...inputProps
}: RowInputProps) => {
  
  const [value, setValue] = useState(inputValue)
  
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
        // onChange={(e) => {
        //   onInputValueChange(e.target.value); 
        //   setValue(e.target.value);
        // }}
        autoComplete="off"
        readOnly={disabled}
        style={{ width: value ? `${calculateCharactersLength(value)}ch` : `20ch`}}
        
        {...inputProps}
      />
    </Text>
  )
}

const StyledInput = styled('input', {
  minWidth: '380px',
  textAlign: 'right',
  color: 'inherit',
})
