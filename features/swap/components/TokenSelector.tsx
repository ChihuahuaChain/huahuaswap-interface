import { useTokenBalance } from 'hooks/useTokenBalance'
import {
  BasicNumberInput,
  Button,
  IconWrapper,
  Inline,
  styled,
  Union,
  useOnClickOutside,
  Text,
  Column,
  dollarValueFormatterWithDecimals
} from 'junoblocks'
import React, { useEffect, useRef, useState } from 'react'
import { useTokenInfo } from '../../../hooks/useTokenInfo'
import { TokenItemState } from '../swapAtoms'
import { useBaseTokenInfo } from 'hooks/useTokenInfo'
import { ConvenienceBalanceButtons } from './ConvenienceBalanceButtons'
import { QueryInput } from './QueryInput'
import { SelectorToggle } from './SelectorToggle'
import { TokenOptionsList } from './TokenOptionsList'
import { useBaseTokenDollarValue } from 'hooks/useBaseTokenDollarValue'


type TokenSelectorProps = {
  amount: number
  token_symbol: string
  readOnly?: boolean
  disabled?: boolean
  size?: 'small' | 'large'
  onChange: (token: TokenItemState) => void
}

export const TokenSelector = ({
  readOnly,
  disabled,
  token_symbol,
  amount,
  onChange,
  size = 'large',
}: TokenSelectorProps) => {
  const wrapperRef = useRef<HTMLDivElement>()
  const inputRef = useRef<HTMLInputElement>()
  const [isTokenListShowing, setTokenListShowing] = useState(false)
  const token_info = useTokenInfo(token_symbol)
  const [tokenSearchQuery, setTokenSearchQuery] = useState('')
  const [isInputForSearchFocused, setInputForSearchFocused] = useState(false)
  const [isInputForAmountFocused, setInputForAmountFocused] = useState(false)
  const { balance: available_amount } = useTokenBalance(token_symbol)
  const [max_applicable_amount, set_max_applicable_amount] = useState(available_amount)
  const shouldShowConvenienceBalanceButtons = Boolean(
    !isTokenListShowing && token_symbol && !readOnly && max_applicable_amount > 0
  )
  const baseToken = useBaseTokenInfo()
  const is_base_token = token_info?.denom === baseToken?.denom;
  const [dollar_price] = useBaseTokenDollarValue()
  const show_usd_estimate = is_base_token && amount > 0
  const handleAmountChange = (amount) => onChange({ symbol: token_symbol, amount, swap_address: '' })
  const handleSelectToken = (selectedTokenSymbol) => {
    onChange({ symbol: selectedTokenSymbol, amount, swap_address: '' })
    setTokenListShowing(false)
  }

  // If is_base_token, we multiply the amount by base_token_price_in_usd
  const formattedDollarValue = dollarValueFormatterWithDecimals(
    is_base_token ? dollar_price * amount : 0, {
    includeCommaSeparation: true,
  })

  useOnClickOutside([wrapperRef], () => {
    setTokenListShowing(false)
  })

  // set_max_applicable_amount when token_info, and available_amount changes
  useEffect(() => {
    // TODO: Get tx_fee from config
    const tx_fee = 1   // defaults to 1huahua
    set_max_applicable_amount(
      is_base_token ? Math.max(available_amount - tx_fee, 0) : available_amount
    );
  }, [token_info, available_amount, set_max_applicable_amount])


  if (size === 'small') {
    return (
      <StyledDivForContainer
        selected={isInputForSearchFocused}
        ref={wrapperRef}
      >
        {isTokenListShowing && (
          <Inline justifyContent="space-between" css={{ padding: '$5 $6' }}>
            <QueryInput
              searchQuery={tokenSearchQuery}
              onQueryChange={setTokenSearchQuery}
              onFocus={() => {
                setInputForSearchFocused(true)
              }}
              onBlur={() => {
                setInputForSearchFocused(false)
              }}
            />
            <Button
              icon={<IconWrapper icon={<Union />} />}
              variant="ghost"
              onClick={() => setTokenListShowing(false)}
              iconColor="tertiary"
            />
          </Inline>
        )}
        {!isTokenListShowing && (
          <Inline css={{ padding: '$6 $4', display: 'grid' }}>
            <SelectorToggle
              availableAmount={available_amount}
              tokenSymbol={token_symbol}
              isSelecting={isTokenListShowing}
              onToggle={
                !disabled
                  ? () => setTokenListShowing((isShowing) => !isShowing)
                  : undefined
              }
            />
          </Inline>
        )}
        {!isTokenListShowing && (
          <StyledInlineForInputWrapper
            rendersButtons={shouldShowConvenienceBalanceButtons}
            selected={readOnly ? false : isInputForAmountFocused}
            onClick={() => {
              inputRef.current.focus()
            }}
          >
            {shouldShowConvenienceBalanceButtons && (
              <Inline gap={4}>
                <ConvenienceBalanceButtons
                  tokenSymbol={token_symbol}
                  availableAmount={max_applicable_amount}
                  onChange={handleAmountChange}
                />
              </Inline>
            )}
            <Column gap={2}>
              <Text variant="primary">
                <BasicNumberInput
                  ref={inputRef}
                  value={amount}
                  min={0}
                  max={max_applicable_amount}
                  disabled={!token_symbol || readOnly || disabled}
                  onChange={handleAmountChange}
                  onFocus={() => {
                    setInputForAmountFocused(true)
                  }}
                  onBlur={() => {
                    setInputForAmountFocused(false)
                  }}
                />
              </Text>

              {show_usd_estimate && (
                <Text variant="caption" color="disabled" wrap={false}>
                  ≈ ${formattedDollarValue}
                </Text>
              )}
            </Column>
          </StyledInlineForInputWrapper>
        )}
        {isTokenListShowing && (
          <TokenOptionsList
            activeTokenSymbol={token_symbol}
            onSelect={handleSelectToken}
            css={{ padding: '$4 $6 $12' }}
            queryFilter={tokenSearchQuery}
            emptyStateLabel={`No result for “${tokenSearchQuery}”`}
            visibleNumberOfTokensInViewport={4.5}
          />
        )}
      </StyledDivForContainer>
    )
  }

  return (
    <StyledDivForContainer
      selected={isInputForAmountFocused || isInputForSearchFocused}
      ref={wrapperRef}
    >
      <StyledDivForWrapper>
        <StyledDivForSelector>
          {isTokenListShowing && (
            <QueryInput
              searchQuery={tokenSearchQuery}
              onQueryChange={setTokenSearchQuery}
              onFocus={() => {
                setInputForSearchFocused(true)
              }}
              onBlur={() => {
                setInputForSearchFocused(false)
              }}
            />
          )}
          {!isTokenListShowing && (
            <SelectorToggle
              availableAmount={available_amount}
              tokenSymbol={token_symbol}
              isSelecting={isTokenListShowing}
              onToggle={
                !disabled
                  ? () => setTokenListShowing((isShowing) => !isShowing)
                  : undefined
              }
            />
          )}
          {shouldShowConvenienceBalanceButtons && (
            <Inline gap={4} css={{ paddingLeft: '$8' }}>
              <ConvenienceBalanceButtons
                disabled={max_applicable_amount <= 0}
                tokenSymbol={token_symbol}
                availableAmount={max_applicable_amount}
                onChange={!disabled ? handleAmountChange : () => { }}
              />
            </Inline>
          )}
        </StyledDivForSelector>
        <StyledDivForAmountWrapper>
          {isTokenListShowing && (
            <Button
              icon={<IconWrapper icon={<Union />} />}
              variant="ghost"
              onClick={() => setTokenListShowing(false)}
              iconColor="tertiary"
            />
          )}
          {!isTokenListShowing && (
            <Column gap={2}>
              <Text variant="primary">
                <BasicNumberInput
                  ref={inputRef}
                  value={amount}
                  min={0}
                  max={max_applicable_amount}
                  disabled={!token_symbol || readOnly || disabled}
                  onChange={handleAmountChange}
                  onFocus={() => {
                    setInputForAmountFocused(true)
                  }}
                  onBlur={() => {
                    setInputForAmountFocused(false)
                  }}
                />
              </Text>

              {show_usd_estimate && (
                <Text variant="caption" color="disabled" wrap={false}>
                  ≈ ${formattedDollarValue}
                </Text>
              )}
            </Column>
          )}
        </StyledDivForAmountWrapper>
        <StyledDivForOverlay
          interactive={readOnly ? false : !isInputForAmountFocused}
          onClick={() => {
            if (!readOnly) {
              if (isTokenListShowing) {
                setTokenListShowing(false)
              } else {
                inputRef.current?.focus()
              }
            }
          }}
        />
      </StyledDivForWrapper>
      {isTokenListShowing && (
        <TokenOptionsList
          activeTokenSymbol={token_symbol}
          onSelect={handleSelectToken}
          queryFilter={tokenSearchQuery}
          css={{ padding: '$4 $6 $12' }}
          emptyStateLabel={`No result for “${tokenSearchQuery}”`}
        />
      )}
    </StyledDivForContainer>
  )
}

const StyledDivForWrapper = styled('div', {
  padding: '$5 $15 $5 $7',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  zIndex: 0,
})

const StyledDivForSelector = styled('div', {
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  zIndex: 1,
})

const StyledDivForAmountWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'relative',
  zIndex: 1,
})

const StyledDivForOverlay = styled('div', {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  backgroundColor: '$colors$dark0',
  transition: 'background-color .1s ease-out',
  variants: {
    interactive: {
      true: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '$colors$dark5',
        },
      },
    },
  },
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

const StyledInlineForInputWrapper = styled('div', {
  borderRadius: '$2',
  transition: 'box-shadow .1s ease-out',
  display: 'flex',
  alignItems: 'center',

  variants: {
    selected: selectedVariantForInputWrapper,

    rendersButtons: {
      true: {
        justifyContent: 'space-between',
        padding: '$10 $12',
      },
      false: {
        justifyContent: 'flex-end',
        padding: '$13 $12',
      },
    },
  },
})
