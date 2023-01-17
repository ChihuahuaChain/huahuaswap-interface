import {
  Button,
  Column,
  formatTokenBalance,
  Exchange,
  IconWrapper,
  Inline,
  styled,
  Text,
  protectAgainstNaN,
} from 'junoblocks'
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { tokenSwapAtom } from '../swapAtoms'

type TransactionTipsProps = {
  onTokenSwaps: () => void
  disabled?: boolean
  size?: 'large' | 'small'
}

export const TransactionTips = ({
  onTokenSwaps,
  disabled,
  size = 'large',
}: TransactionTipsProps) => {
  const [swappedPosition, setSwappedPositions] = useState(false)
  const { input_token, output_token } = useRecoilValue(tokenSwapAtom)
  const pool_price = formatTokenBalance(
    protectAgainstNaN(output_token.amount / input_token.amount)
  )
  const isShowing = Boolean(input_token.symbol) && Boolean(output_token.symbol);
  const switchTokensButton = (
    <Button
      icon={<StyledIconWrapper icon={<Exchange />} flipped={swappedPosition} />}
      variant="ghost"
      onClick={
        !disabled
          ? () => {
            setSwappedPositions(!swappedPosition)
            onTokenSwaps()
          }
          : undefined
      }
      iconColor="tertiary"
    />
  )

  const transactionRates = (
    <>
      1 {input_token.symbol} ≈ {pool_price}{' '}
      {output_token.symbol}
    </>
  )

  if (size === 'small') {
    return (
      <Inline
        justifyContent="space-between"
        css={{
          padding: isShowing ? '$10 $12 $10 $9' : '$11 $12 $11 $9',
          borderTop: '1px solid $borderColors$inactive',
          borderBottom: '1px solid $borderColors$inactive',
        }}
      >
        {switchTokensButton}
        {isShowing && (
          <Column align="flex-end" gap={2}>
            <Text variant="caption" color="disabled" wrap={false}>
              {transactionRates}
            </Text>
          </Column>
        )}
      </Inline>
    )
  }

  return (
    <StyledDivForWrapper>
      <StyledDivForRateWrapper>
        {switchTokensButton}

        {isShowing && (
          <Text variant="legend" wrap={false}>
            {transactionRates}
          </Text>
        )}
      </StyledDivForRateWrapper>
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  padding: '$8 $16 $8 $12',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'right',
  borderTop: '1px solid $borderColors$inactive',
  borderBottom: '1px solid $borderColors$inactive',
})

const StyledDivForRateWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  textAlign: 'left',
  columnGap: '$space$6',
})

const StyledIconWrapper = styled(IconWrapper, {
  variants: {
    flipped: {
      true: {
        transform: 'rotateX(180deg)',
      },
      false: {
        transform: 'rotateX(0deg)',
      },
    },
  },
})
