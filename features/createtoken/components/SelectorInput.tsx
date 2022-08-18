import {
  calculateCharactersLength,
  styled,
  Text,
  useAmountChangeController,
} from 'junoblocks'
import React, { HTMLProps, Ref, useState} from 'react'

type SelectorInputProps = {
  inputValue: string
  disabled: boolean
  placeholder: string
  isNumber: boolean
  onInputValueChange: (inputValue: string) => void
  inputRef?: Ref<HTMLInputElement>
} & Omit<HTMLProps<HTMLInputElement>, 'ref'>

export const SelectorInput = ({
  inputValue,
  disabled,
  placeholder,
  isNumber,
  onInputValueChange,
  inputRef,
  ...inputProps
}: SelectorInputProps) => {
  const [ value, setValue ] = useState('')

  return (
    <Text variant="primary">
      <StyledInput
        ref={inputRef}
        type={isNumber ? "number": "text"}
        lang="en-US"
        placeholder={placeholder}
        min={0}
        value={value}
        onChange={
          !disabled ? ({ target: { value } }) => setValue(value) : undefined
        }
        autoComplete="off"
        readOnly={disabled}
        style={{ width: `${calculateCharactersLength(value)}ch` }}
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
