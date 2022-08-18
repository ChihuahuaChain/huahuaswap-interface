import {
  calculateCharactersLength,
  styled,
  Text,
  useAmountChangeController,
} from 'junoblocks'
import React, { HTMLProps, Ref, useState } from 'react'

type SelectorInputProps = {
  inputValue: number
  disabled: boolean
  onInputValueChange: (value: String) => void
  inputRef?: Ref<HTMLInputElement>
} & Omit<HTMLProps<HTMLInputElement>, 'ref'>

export const SelectorInput = ({
  inputValue,
  disabled,
  onInputValueChange,
  inputRef,
  ...inputProps
}: SelectorInputProps) => {
  
  // const { value, setValue } = useAmountChangeController({
  //   value,
  //   onInputValueChange,
  // })

  const [value, setValue] = useState('')

  return (
    <Text variant="primary">
      <StyledInput
        ref={inputRef}
        type="number"
        lang="en-US"
        placeholder="0.0"
        min={0}
        value={inputValue}
        onChange={onInputValueChange}
        // onChange={
        //   !disabled ? ({ target: { value } }) => setValue(value) : undefined
        // }
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
