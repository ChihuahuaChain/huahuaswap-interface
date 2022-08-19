import {
  Button,
  IconWrapper,
  Inline,
  styled,
  Plus, Reject
} from 'junoblocks'
import React, { useRef, useState, useEffect, ChangeEvent } from 'react'

import { RowItem } from './RowItem'
import { uid } from '../../../util/random'

export interface Balance {
  address: string
  amount: string
}
type AddressBalancesProps = {
  entries: [string, Balance][]
  onAdd: () => void
  onChange: (key: string, balance: Balance) => void
  onRemove: (key: string) => void
}

export const AddressBalances = ({
  entries,
  onAdd,
  onChange,
  onRemove
}: AddressBalancesProps) => {
  const wrapperRef = useRef<HTMLDivElement>()
  const inputRef = useRef<HTMLInputElement>()

  const [isInputFocused, setInputFocused] = useState(false)
  // const handleInputChange = (inputValue) => onChange(label, inputValue)

  return (
    <StyledDivForContainer selected={isInputFocused} ref={wrapperRef}>
      <StyledDivForWrapper>
        <>
          {entries.map(([id], i) => (
            <AddressBalance
              key={`ib-${id}`}
              id={id}
              isLast={i === entries.length - 1}
              onAdd={onAdd}
              onChange={onChange}
              onRemove={onRemove}
            />
          ))}
        </>
      </StyledDivForWrapper>
    </StyledDivForContainer>
  )
}

export interface UseInputStateProps {
  id: string
  name: string
  title: string
  subtitle?: string
  defaultValue?: string
  placeholder?: string
}


export const useInputState = ({ defaultValue, ...args }: UseInputStateProps) => {
  const [value, setValue] = useState<string>(() => defaultValue ?? '')
  useEffect(() => {
    if (defaultValue) setValue(defaultValue)
  }, [defaultValue])
  return {
    value,
    onChange: (obj: string | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(typeof obj === 'string' ? obj : obj.target.value)
    },
    ...args,
  }
}

export interface AddressBalanceProps {
  id: string
  isLast: boolean
  onAdd: AddressBalancesProps['onAdd']
  onChange: AddressBalancesProps['onChange']
  onRemove: AddressBalancesProps['onRemove']
}

export const AddressBalance = ({ id, isLast, onAdd, onChange, onRemove }: AddressBalanceProps) => {
  
  const htmlId = uid()

  const addressState = useInputState({
    id: `ib-address-${htmlId}`,
    name: `ib-address-${htmlId}`,
    title: `Wallet Address`,
  })

  const amountState = useInputState({
    id: `ib-balance-${htmlId}`,
    name: `ib-balance-${htmlId}`,
    title: `Balance`,
    // placeholder: '0',
  })

  const [addressValue, setAddressValue] = useState('') 
  const [amountValue, setAmountValue] = useState('') 

  useEffect(() => {
    onChange(id, {
      address: addressValue,
      amount: amountValue,
    })
    console.log("OnChange call")
    console.log(addressValue)
    console.log(amountValue)
  }, [addressValue, amountValue, id])

  
  return (
    <StyledDivForDivideWrapper>
    {/* <div className="grid relative grid-cols-[1fr_1fr_auto] space-x-2"> */}
      {/* <AddressInput {...addressState} />
      <NumberInput {...amountState} /> */}
      <RowItem
        label={'Address'}
        placeholder={'chihuahua1234567890abcdefghijklmnopqrstuvwxyz'}
        isNumber={false}
        {...addressState}
        onChange={(label, inputValue) => {
          setAddressValue(inputValue)
        }}

        // disabled={isUiDisabled}
      />
      <RowItem
        label={'Amount'}
        placeholder={'0'}
        isNumber={false}
        {...amountState}
        onChange={(label, inputValue) => {
          setAmountValue(inputValue)
        }}
      />
      <div className="flex justify-end items-end pb-2 w-8">
        <button
          className="flex justify-center items-center p-2 bg-plumbus-80 hover:bg-plumbus-60 rounded-full"
          onClick={() => (isLast ? onAdd() : onRemove(id))}
          type="button"
        >
          {isLast ? <IconWrapper icon={<Plus />} style={{color:'white'}} /> : <IconWrapper icon={<Reject />} style={{color:'white'}}/> }
        </button>
      </div>
    {/* </div> */}
    </StyledDivForDivideWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  padding: '$5 $5 $5 $7',
  display: 'flex flex-row',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  zIndex: 0,
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
const StyledDivForDivideWrapper = styled('div', {
  // padding: '$5 $5 $5 $7',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  zIndex: 0,
})

