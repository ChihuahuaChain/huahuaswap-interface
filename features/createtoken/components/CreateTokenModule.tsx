import { useTokenList } from 'hooks/useTokenList'
import { styled, useMedia, usePersistance, Text } from 'junoblocks'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  TransactionStatus,
  transactionStatusState,
} from 'state/atoms/transactionAtoms'
import { TextInput } from './TextInput'

import { RowItem } from './RowItem'
import { TransactionAction } from './TransactionAction'

export const CreateTokenModule = () => {
  /* connect to recoil */
  const transactionStatus = useRecoilValue(transactionStatusState)
  const isUiDisabled =
    transactionStatus === TransactionStatus.EXECUTING

  // const [name, setName] = useState('My CW20 Contract')
  // const [symbol, setSymbol] = useState('HCW')
  // const [decimals, setDecimals] = useState(6)
  // const [balances, setBalances] = useState([])
  // const [minterAddress, setMinterAddress] = useState('chihuahua1234567890abcdefghijklmnopqrstuvwxyz')
  // const [cap, setCap] = useState(9999)
  // const [project, setProject] 

  const [data, setData] = useState({ 
    name: 'My CW20 Contract',
    symbol: 'HCW',
    decimals: 6,
    initial_balances: [],
    mint: {
      minter: 'chihuahua17ey9ta0wlattku2petypuyuux3qtu27r9mvwvx', //chihuahua1234567890abcdefghijklmnopqrstuvwxyz
      cap: null,
    },
    marketing: {
      project: 'My CW20 Contract',
      description: 'This is my cw20 contract',
      marketing: 'chihuahua17ey9ta0wlattku2petypuyuux3qtu27r9mvwvx',
      logo: {
        url: 'https://example.com/image.jpg'
      },
    },
  })
  
  return (
    <>
      <Text variant="primary">
        Contract Details
      </Text>
      <StyledDivForWrapper>
        <RowItem
          label={"Name"}
          placeholder={data.name}
          isNumber={false}
          onChange={(label, inputValue) => {
            data.name = inputValue
            setData(data)
          }}
          disabled={isUiDisabled}
        />
        <RowItem
          label={"Symbol"}
          placeholder={data.symbol}
          isNumber={false}
          onChange={(label, inputValue) => {
            data.symbol = inputValue
            setData(data)
          }}
          disabled={isUiDisabled}
        />
        <RowItem
          label={"Decimals"}
          placeholder={data.decimals.toString()}
          isNumber={true}
          onChange={(label, inputValue) => {
            data.decimals = parseInt(inputValue)
            setData(data)
          }}
          disabled={isUiDisabled}
        />

      </StyledDivForWrapper>
      <TransactionAction
        msg={data}
        disabled={isUiDisabled}
      />
    </>
  )
}

const StyledDivForWrapper = styled('div', {
  borderRadius: '8px',
  backgroundColor: '$colors$dark10',
})
