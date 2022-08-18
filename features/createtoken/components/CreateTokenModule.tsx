import { useTokenList } from 'hooks/useTokenList'
import { 
  styled, useMedia, usePersistance, Text, Button,
  IconWrapper,
  Plus, Reject
} from 'junoblocks'
import { useEffect, useRef, useState, useMemo } from 'react'
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
  const initial_balances = useRef([{
    index: 0,
    address: '',
    amount: ''
  }]);
  // const [initial_balances, setInitialBalances] = useState([{
  //   index: 0,
  //   address: '',
  //   amount: ''
  // }]);

  const [data, setData] = useState({
    name: 'My CW20 Contract',
    symbol: 'HCW',
    decimals: 6,
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

  useEffect(() => {
    // setData(data)
    console.log(initial_balances);
  }, [refresh])

  const values = useMemo(() => {

  }, [data, refresh])
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
          {initial_balances.current?.map(({ address, amount }, index) => (
            <div key={index}>
              <StyledDivForDivideWrapper>
                <RowItem
                  label={'Address'}
                  placeholder={'chihuahua1234567890abcdefghijklmnopqrstuvwxyz'}
                  isNumber={false}
                  inputValue={address}
                  onChange={(label, inputValue) => {
                    // initial_balances[index].address = inputValue
                    initial_balances.current[index].index = index;
                    initial_balances.current[index].address = inputValue;
                  }}

                  disabled={isUiDisabled}
                />
                <RowItem
                  label={'Amount'}
                  placeholder={'0'}
                  isNumber={false}
                  inputValue={amount}
                  onChange={(label, inputValue) => {
                    // initial_balances[index].amount = inputValue
                    initial_balances.current[index].index = index;
                    initial_balances.current[index].amount = inputValue;
                  }}
                  disabled={isUiDisabled}
                />
                <StyledButton>
                  <Button
                    variant="primary"
                    disabled={false}
                    onClick={initial_balances.current.length - 1 == index ? 
                    () => {
                      // initial_balances.push({
                      //   address: '',
                      //   amount: '',
                      // })
                      initial_balances.current.push({ index: index + 1, address: '', amount: '' });
                      setRefresh(!refresh)
                    } : 
                    () => {

                      let list = []
                      for (let i = 0; i < initial_balances.current.length; i ++) {
                        if (i == index)
                          continue;
                        list.push(initial_balances.current[i])
                      }
                      initial_balances.current = list;
                      // customData.initial_balances = list
                      // setData(customData)
                      console.log('[Remove] = ', list)
                      setRefresh(!refresh)
                    }
                    }
                  >

                    {initial_balances.current.length - 1 == index ? <IconWrapper icon={<Plus />} /> : <IconWrapper icon={<Reject />} />}
                  </Button>
                </StyledButton>
              </StyledDivForDivideWrapper>
            </div>
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
