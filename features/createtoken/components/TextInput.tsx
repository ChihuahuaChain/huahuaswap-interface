import {
  calculateCharactersLength,
  styled,
  Text,
  useAmountChangeController,
} from 'junoblocks'
import React, { HTMLProps, Ref } from 'react'

type TextInputProps = {
  string: string
  disabled: boolean
  // onStringChange: (string: string) => void
  // inputRef?: Ref<HTMLInputElement>
} & Omit<HTMLProps<HTMLInputElement>, 'ref'>

export const TextInput = ({
  string,
  disabled,
  // inputRef,
  ...inputProps
}: TextInputProps) => {
  
  return (
    <Text variant="primary">
      <StyledInput
        type="string"
        lang="en-US"
        placeholder="0.0"
        min={0}
        value={string}
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
