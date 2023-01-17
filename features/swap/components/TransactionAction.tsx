import { useConnectWallet } from 'hooks/useConnectWallet'
import { Button, Inline, Spinner, styled, Text } from 'junoblocks'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import { NETWORK_FEE } from 'util/constants'
import { useTokenSwap } from '../hooks'
import { slippageAtom, tokenSwapAtom } from '../swapAtoms'
import { SlippageSelector } from './SlippageSelector'

type TransactionTipsProps = {
  size?: 'small' | 'large'
}

export const TransactionAction = ({
  size = 'large',
}: TransactionTipsProps) => {
  const { mutate: handleSwap, isLoading: isExecutingTransaction } =
    useTokenSwap()
  const { mutate: connectWallet } = useConnectWallet()
  const [{ input_token, output_token }, setTokenSwapState] = useRecoilState(tokenSwapAtom)

  /* wallet state */
  const { status } = useRecoilValue(walletState)
  const [slippage, setSlippage] = useRecoilState(slippageAtom)

  const handleSwapButtonClick = () => {
    if (status === WalletStatusType.connected) {
      handleSwap()
    }

    connectWallet(null)
  }

  const shouldDisableSubmissionButton =
    status !== WalletStatusType.connected ||
    isExecutingTransaction ||
    !input_token.symbol ||
    !output_token.symbol ||
    input_token.amount == 0 ||
    output_token.amount == 0;

  if (size === 'small') {
    return (
      <>
        <Inline css={{ display: 'grid', padding: '$6 0' }}>
          <SlippageSelector
            slippage={slippage}
            onSlippageChange={setSlippage}
            css={{ width: '100%' }}
          />
        </Inline>
        <Inline
          justifyContent="space-between"
          css={{
            padding: '$8 $12',
            backgroundColor: '$colors$dark10',
            borderRadius: '$1',
          }}
        >
          <Text variant="legend" transform="uppercase">
            Swap fee
          </Text>
          <Text variant="legend">{NETWORK_FEE * 100}%</Text>
        </Inline>
        <Inline css={{ display: 'grid', paddingTop: '$8' }}>
          <Button
            variant="primary"
            size="large"
            disabled={shouldDisableSubmissionButton}
            onClick={
              !isExecutingTransaction
                ? handleSwapButtonClick
                : undefined
            }
          >
            {isExecutingTransaction ? <Spinner instant /> : 'Swap'}
          </Button>
        </Inline>
      </>
    )
  }

  return (
    <StyledDivForWrapper>
      <StyledDivForInfo>
        <StyledDivColumnForInfo kind="slippage">
          <SlippageSelector
            slippage={slippage}
            onSlippageChange={setSlippage}
            css={{ borderRadius: '$2 0 0 $2' }}
          />
        </StyledDivColumnForInfo>
        <StyledDivColumnForInfo kind="fees">
          <Text variant="legend">Swap fee ({NETWORK_FEE * 100}%)</Text>
        </StyledDivColumnForInfo>
      </StyledDivForInfo>
      <Button
        variant="primary"
        size="large"
        disabled={shouldDisableSubmissionButton}
        onClick={
          !isExecutingTransaction
            ? handleSwapButtonClick
            : undefined
        }
      >
        {isExecutingTransaction ? <Spinner instant /> : 'Swap'}
      </Button>
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 150px',
  columnGap: 12,
  alignItems: 'center',
  padding: '12px 0',
})

const StyledDivForInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  textTransform: 'uppercase',
  borderRadius: 8,
})

const StyledDivColumnForInfo = styled('div', {
  display: 'grid',
  variants: {
    kind: {
      slippage: {
        backgroundColor: 'transparent',
        minWidth: '140px',
        borderRadius: '$4 0 0 $4',
        borderRight: '1px solid $borderColors$default',
      },
      fees: {
        backgroundColor: '$colors$dark10',
        flex: 1,
        padding: '$space$8 $space$12',
        borderRadius: '0 $2 $2 0',
      },
    },
  },
})
