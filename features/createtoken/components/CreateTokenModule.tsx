import { styled, Text } from 'junoblocks'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import {
  TransactionStatus,
  transactionStatusState,
} from 'state/atoms/transactionAtoms'
import { AddressBalances } from './AddressBalances'
import { useAddressBalancesState } from '../hooks'
import { RowItem } from './RowItem'
import { TransactionAction } from './TransactionAction'
import { JsonObject } from '@cosmjs/cosmwasm'

export const CreateTokenModule = () => {
  /* connect to recoil */
  const transactionStatus = useRecoilValue(transactionStatusState)
  const isUiDisabled = transactionStatus === TransactionStatus.EXECUTING
  const balancesState = useAddressBalancesState()

  const placeholderdata: JsonObject = {
    name: 'My CW20 Contract',
    symbol: 'HCW',
    decimals: 6,
    mint: {
      minter: 'chihuahua1ehkt6apyy5sxeccw3dfgq8epntn6trfgxgjxtw',
      cap: 9999,
    },
    initial_balances: [
      {
        address: 'chihuahua1ehkt6apyy5sxeccw3dfgq8epntn6trfgxgjxtw',
        amount: '9999',
      },
    ],
    marketing: {
      project: 'My CW20 Contract',
      description: 'This is my cw20 contract',
      marketing: 'chihuahua1ehkt6apyy5sxeccw3dfgq8epntn6trfgxgjxtw',
      logo: {
        url: 'https://example.com/image.jpg',
      },
    },
  }
  const [data, setData] = useState({
    name: '',
    symbol: '',
    decimals: 6,
    mint: {
      minter: '',
      cap: 9999,
    },
    initial_balances: [
      {
        address: '',
        amount: '',
      },
    ],
    marketing: {
      project: '',
      description: '',
      marketing: '',
      logo: {
        url: '',
      },
    },
  })

  return (
    <>
      <StyledText>
        <Text variant="primary">Contract Details</Text>
      </StyledText>

      <StyledSubText>
        <Text variant="secondary">
          Basic information about your new contract
        </Text>
      </StyledSubText>

      <StyledDivForWrapper>
        <RowItem
          label={'Name'}
          placeholder={placeholderdata.name}
          isNumber={false}
          inputValue={''}
          onChange={(label, inputValue) => {
            data.name = inputValue
            setData(data)
          }}
          disabled={isUiDisabled}
        />

        <RowItem
          label={'Symbol'}
          placeholder={placeholderdata.symbol}
          isNumber={false}
          inputValue={''}
          onChange={(label, inputValue) => {
            data.symbol = inputValue
            setData(data)
          }}
          disabled={isUiDisabled}
        />
        <RowItem
          label={'Decimals'}
          placeholder={placeholderdata.decimals.toString()}
          isNumber={true}
          onChange={(label, inputValue) => {
            data.decimals = parseInt(inputValue)
            setData(data)
          }}
          disabled={true}
        />
      </StyledDivForWrapper>

      <StyledText>
        <Text variant="primary">Initial Balances</Text>
      </StyledText>
      <StyledSubText>
        <Text variant="secondary">
        Enter Wallet Address and Initial Balance (include 6 extra decimals, e.g. 1,000,000 tokens = 1,000,000,000,000)
        </Text>
      </StyledSubText>
      <StyledDivForWrapper>
        <AddressBalances
          entries={balancesState.entries}
          onAdd={balancesState.add}
          onChange={balancesState.update}
          onRemove={balancesState.remove}
        />
      </StyledDivForWrapper>

      <StyledText>
        <Text variant="primary">Minting Details</Text>
      </StyledText>
      <StyledSubText>
        <Text variant="secondary">Your new contract minting rules</Text>
      </StyledSubText>
      <StyledDivForWrapper>
        <RowItem
          label={'Minter Address'}
          placeholder={placeholderdata.mint.minter}
          isNumber={false}
          onChange={(label, inputValue) => {
            data.mint.minter = inputValue
            setData(data)
          }}
          disabled={isUiDisabled}
        />
        <RowItem
          label={'Cap'}
          placeholder={placeholderdata.mint.cap}
          isNumber={true}
          onChange={(label, inputValue) => {
            data.mint.cap = inputValue
            setData(data)
          }}
          disabled={isUiDisabled}
        />
      </StyledDivForWrapper>

      <StyledText>
        <Text variant="primary">Marketing Details</Text>
      </StyledText>
      <StyledSubText>
        <Text variant="secondary">Public metadata for your new contract</Text>
      </StyledSubText>
      <StyledDivForWrapper>
        <RowItem
          label={'Project'}
          placeholder={placeholderdata.marketing.project}
          isNumber={false}
          onChange={(label, inputValue) => {
            data.marketing.project = inputValue
            setData(data)
          }}
          disabled={isUiDisabled}
        />
        <RowItem
          label={'Description'}
          placeholder={placeholderdata.marketing.description}
          isNumber={false}
          onChange={(label, inputValue) => {
            data.marketing.description = inputValue
            setData(data)
          }}
          disabled={isUiDisabled}
        />
        <RowItem
          label={'Wallet Address (marketing)'}
          placeholder={placeholderdata.marketing.marketing}
          isNumber={false}
          onChange={(label, inputValue) => {
            data.marketing.marketing = inputValue
            setData(data)
          }}
          disabled={isUiDisabled}
        />
        <RowItem
          label={'Logo URL'}
          placeholder={placeholderdata.marketing.logo.url}
          isNumber={false}
          onChange={(label, inputValue) => {
            data.marketing.logo.url = inputValue
            setData(data)
          }}
          disabled={isUiDisabled}
        />
      </StyledDivForWrapper>

      <TransactionAction
        key={12345}
        msg={data}
        entries={balancesState.entries}
        disabled={isUiDisabled}
      />
    </>
  )
}

const StyledDivForWrapper = styled('div', {
  borderRadius: '8px',
  backgroundColor: '$colors$dark10',
  marginBottom: '$32',
})

const StyledText = styled('div', {
  borderRadius: '8px',
  padding: '0 0 $2 0',
})

const StyledSubText = styled('div', {
  borderRadius: '8px',
  padding: '0 0 $8 0',
})
