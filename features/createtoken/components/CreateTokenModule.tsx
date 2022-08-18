import { useTokenList } from 'hooks/useTokenList'
import { 
  styled, useMedia, usePersistance, Text, Button,
  IconWrapper,
  Plus, Reject
} from 'junoblocks'
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
  const isUiDisabled = transactionStatus === TransactionStatus.EXECUTING

  // const [name, setName] = useState('My CW20 Contract')
  // const [symbol, setSymbol] = useState('HCW')
  // const [decimals, setDecimals] = useState(6)
  // const [balances, setBalances] = useState([])
  // const [minterAddress, setMinterAddress] = useState('chihuahua1234567890abcdefghijklmnopqrstuvwxyz')
  // const [cap, setCap] = useState(9999)
  // const [project, setProject]

  const [refresh, setRefresh] = useState(false)

  const [data, setData] = useState({
    name: 'My CW20 Contract',
    symbol: 'HCW',
    decimals: 6,
    initial_balances: [
      {
        address: 'chihuahua17ey9ta0wlattku2petypuyuux3qtu27r9mvwvx',
        amount: '9999',
      },
    ],
    mint: {
      minter: 'chihuahua17ey9ta0wlattku2petypuyuux3qtu27r9mvwvx', //chihuahua1234567890abcdefghijklmnopqrstuvwxyz
      cap: null,
    },
    marketing: {
      project: 'My CW20 Contract',
      description: 'This is my cw20 contract',
      marketing: 'chihuahua17ey9ta0wlattku2petypuyuux3qtu27r9mvwvx',
      logo: {
        url: 'https://example.com/image.jpg',
      },
    },
  })

  const onAdd = () => {
    data.initial_balances.push({
      address: 'chihuahua1234567890abcdefghijklmnopqrstuvwxyz',
      amount: '9999',
    })
    setData(data)
    setRefresh(!refresh)
  }

  return (
    <>
      <StyledText>
        <Text variant="primary">Contract Details</Text>
      </StyledText>
      <StyledDivForWrapper>
        <RowItem
          label={'Name'}
          placeholder={data.name}
          isNumber={false}
          onChange={(label, inputValue) => {
            data.name = inputValue
            setData(data)
          }}
          disabled={isUiDisabled}
        />
        <RowItem
          label={'Symbol'}
          placeholder={data.symbol}
          isNumber={false}
          onChange={(label, inputValue) => {
            data.symbol = inputValue
            setData(data)
          }}
          disabled={isUiDisabled}
        />
        <RowItem
          label={'Decimals'}
          placeholder={data.decimals.toString()}
          isNumber={true}
          onChange={(label, inputValue) => {
            data.decimals = parseInt(inputValue)
            setData(data)
          }}
          disabled={isUiDisabled}
        />
      </StyledDivForWrapper>

      <StyledText>
        <Text variant="primary">Initial Balances</Text>
      </StyledText>
      <StyledDivForWrapper>
        <>
          {data.initial_balances?.map(({ address, amount }, index) => (
            <>
              <StyledDivForDivideWrapper>
                <RowItem
                  label={'Address'}
                  placeholder={'chihuahua1234567890abcdefghijklmnopqrstuvwxyz'}
                  isNumber={false}
                  onChange={(label, inputValue) => {
                    // data.balances = inputValue
                    // setData(data)
                  }}
                  disabled={isUiDisabled}
                />
                <RowItem
                  label={'Amount'}
                  placeholder={'9999'}
                  isNumber={false}
                  onChange={(label, inputValue) => {
                    // data.balances = inputValue
                    // setData(data)
                  }}
                  disabled={isUiDisabled}
                />
                <StyledButton>
                  <Button
                    variant="primary"
                    disabled={false}
                    onClick={onAdd}
                  >

                    {data.initial_balances.length - 1 == index ? <IconWrapper icon={<Plus />} /> : <IconWrapper icon={<Reject />} />}
                  </Button>
                </StyledButton>
              </StyledDivForDivideWrapper>
            </>
          ))}
        </>
      </StyledDivForWrapper>
      <TransactionAction msg={data} disabled={isUiDisabled} />
    </>
  )
}

const StyledDivForWrapper = styled('div', {
  borderRadius: '8px',
  backgroundColor: '$colors$dark10',
})

const StyledText = styled('div', {
  borderRadius: '8px',
  padding: '$5 $5 $5 $7',
})

const StyledDivForDivideWrapper = styled('div', {
  // padding: '$5 $5 $5 $7',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  zIndex: 0,
})

const StyledButton = styled('div', {
  position: 'absolute',
  right: '-65px',
  top: '15px',
})
