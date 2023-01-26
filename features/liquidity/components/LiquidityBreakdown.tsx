import {
  Button,
  Column,
  Divider,
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
  ImageForTokenLogo,
  InfoIcon,
  Inline,
  protectAgainstNaN,
  Text,
  Tooltip,
} from 'junoblocks'
import React from 'react'
import { TokenInfo } from '../../../queries/usePoolsListQuery'
import { PoolLiquidityState } from '../../../queries/useQueryPools'
import { formatCompactNumber } from '../../../util/formatCompactNumber'

type LiquidityBreakdownProps = {
  base_token: TokenInfo
  quote_token: TokenInfo
  poolId: string
  liquidity: PoolLiquidityState
  size: 'large' | 'small'
}

export const LiquidityBreakdown = ({
  base_token,
  quote_token,
  poolId,
  liquidity,
  size = 'large',
}: LiquidityBreakdownProps) => {
  const pool_price = protectAgainstNaN(liquidity.quote_reserve / liquidity.base_reserve)
  const price_break_down = `1 ${base_token.symbol} ≈ ${formatTokenBalance(pool_price)} ${quote_token.symbol}`

  const formatted_total_liquidity = dollarValueFormatterWithDecimals(
    liquidity.total_liquidity_in_usd,
    { includeCommaSeparation: true }
  )
  const formatted_base_token_amount = formatTokenBalance(liquidity.base_reserve, {
    includeCommaSeparation: true,
  })
  const formatted_quote_token_amount = formatTokenBalance(liquidity.quote_reserve, {
    includeCommaSeparation: true,
  })

  const compact_base_token_amount = formatCompactNumber(liquidity.base_reserve, 'tokenAmount')
  const compact_quote_token_amount = formatCompactNumber(liquidity.quote_reserve, 'tokenAmount')
  const compact_total_liquidity = formatCompactNumber(liquidity.total_liquidity_in_usd)

  if (size === 'small') {
    return (
      <>
        <Inline justifyContent="space-between" css={{ paddingBottom: '$12' }}>
          <Inline gap={12}>
            {[base_token, quote_token].map((token) => (
              <Inline gap={3} key={token.symbol}>
                <ImageForTokenLogo
                  size="large"
                  logoURI={token.logoURI}
                  alt={token.symbol}
                />
                <Text variant="link">{token.symbol}</Text>
              </Inline>
            ))}
          </Inline>
          <Text variant="legend" color="secondary" transform="capitalize">
            {price_break_down}
          </Text>
        </Inline>
        <Divider />
        <Inline justifyContent="space-between" css={{ padding: '$14 0 $12' }}>
          <Column gap={6} align="flex-start" justifyContent="flex-start">
            <Text variant="legend" color="secondary" align="left">
              Total liquidity
            </Text>
            <Text variant="header">
              ${formatted_total_liquidity}
            </Text>
          </Column>
        </Inline>
      </>
    )
  }

  return (
    <>
      <Inline justifyContent="space-between" css={{ padding: '$8 0' }}>
        <Inline gap={18}>
          <Text variant="primary">Pool #{poolId}</Text>
          <Inline gap={12}>
            <Inline gap={6}>
              <ImageForTokenLogo
                size="large"
                logoURI={base_token.logoURI}
                alt={base_token.symbol}
              />
              <ImageForTokenLogo
                size="large"
                logoURI={quote_token.logoURI}
                alt={quote_token.symbol}
              />
            </Inline>
          </Inline>
        </Inline>
        <Text variant="legend" color="secondary" transform="lowercase">
          {price_break_down}
        </Text>
      </Inline>

      <Divider />

      <>
        <TotalInfoRow>
          <Column gap={6} align="flex-start" justifyContent="flex-start">
            <Text variant="legend" color="secondary" align="left">
              Total liquidity
            </Text>
            <Inline gap={2}>
              <Text variant="header">
                ${compact_total_liquidity}
              </Text>
              <Tooltip
                label={`${formatted_total_liquidity}`}
                aria-label={`${formatted_total_liquidity} in total liquidity`}
              >
                <Button
                  variant="ghost"
                  size="small"
                  icon={<InfoIcon />}
                  iconColor={'secondary'}
                />
              </Tooltip>
            </Inline>
          </Column>

          <Column gap={6} align="flex-start" justifyContent="flex-start">
            <Text variant="legend" color="secondary" align="left">
              {base_token?.symbol}
            </Text>
            <Inline gap={2}>
              <Text variant="header">
                {compact_base_token_amount} ${base_token?.symbol}
              </Text>
              <Tooltip
                label={`${formatted_base_token_amount} $${base_token?.symbol}`}
                aria-label={`${formatted_base_token_amount} $${base_token?.symbol} in liquidity`}
              >
                <Button
                  variant="ghost"
                  size="small"
                  icon={<InfoIcon />}
                  iconColor={'secondary'}
                />
              </Tooltip>
            </Inline>
          </Column>

          <Column gap={6} align="flex-start" justifyContent="flex-start">
            <Text variant="legend" color="secondary" align="left">
              {quote_token?.symbol}
            </Text>
            <Inline gap={2}>
              <Text variant="header">
                {compact_quote_token_amount} ${quote_token?.symbol}
              </Text>
              <Tooltip
                label={`${formatted_quote_token_amount} $${quote_token?.symbol}`}
                aria-label={`${formatted_quote_token_amount} $${quote_token?.symbol} in liquidity`}
              >
                <Button
                  variant="ghost"
                  size="small"
                  icon={<InfoIcon />}
                  iconColor={'secondary'}
                />
              </Tooltip>
            </Inline>
          </Column>
        </TotalInfoRow>
      </>
    </>
  )
}

function TotalInfoRow({ children }) {
  const baseCss = { padding: '$15 0 $18' }

  return (
    <Inline gap={8} justifyContent="space-between" css={baseCss}>
      {children}
    </Inline>
  )
}
