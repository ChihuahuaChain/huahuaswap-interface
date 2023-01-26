import { useTokenInfo } from 'hooks/useTokenInfo'
import {
  Button,
  Card,
  CardContent,
  Column,
  convertMicroDenomToDenom,
  Divider,
  dollarValueFormatterWithDecimals,
  Inline,
  protectAgainstNaN,
  Text,
  useSubscribeInteractions,
} from 'junoblocks'
import { UnderlyingAssetRow } from './UnderlyingAssetRow'
import { TokenInfo } from '../../../queries/usePoolsListQuery'
import { PoolLiquidityState } from '../../../queries/useQueryPools'

type ManageLiquidityCardProps = {
  base_token: TokenInfo
  quote_token: TokenInfo
  liquidity: PoolLiquidityState
  onClick: () => void
}

export const ManageLiquidityCard = ({
  base_token,
  quote_token,
  liquidity,
  onClick,
}: ManageLiquidityCardProps) => {
  const [refForCard, cardInteractionState] = useSubscribeInteractions()
  const didProvideLiquidity =
    liquidity.provided_lp_amount > 0
  const providedLiquidityDollarValue = dollarValueFormatterWithDecimals(
    liquidity.provided_liquidity_in_usd,
    { includeCommaSeparation: true }
  )
  const lp_ratio = protectAgainstNaN(liquidity.provided_lp_amount / liquidity.total_lp_amount)
  const provided_base_token_balance = lp_ratio * liquidity.base_reserve
  const provided_quote_token_balance = lp_ratio * liquidity.quote_reserve

  return (
    <Card
      ref={refForCard}
      tabIndex={-1}
      role="button"
      variant={
        didProvideLiquidity ? 'primary' : 'secondary'
      }>
      <CardContent>
        <Text variant="legend" color="body" css={{ padding: '$16 0 $6' }}>
          Your liquidity
        </Text>
        <Text variant="hero">${providedLiquidityDollarValue}</Text>
        <Text variant="link" color="brand" css={{ paddingTop: '$2' }}>
          ${providedLiquidityDollarValue}{' available'}
        </Text>
      </CardContent>
      <Divider offsetTop="$14" offsetBottom="$12" />
      <CardContent>
        <Text variant="legend" color="secondary" css={{ paddingBottom: '$12' }}>
          Underlying assets
        </Text>
        <Column gap={6} css={{ paddingBottom: '$16' }}>
          <UnderlyingAssetRow
            provided_liquidity_in_usd={liquidity.provided_liquidity_in_usd / 2}
            token_amount={provided_base_token_balance}
            logoURI={base_token.logoURI}
            symbol={base_token.symbol}
          />
          <UnderlyingAssetRow
            provided_liquidity_in_usd={liquidity.provided_liquidity_in_usd / 2}
            token_amount={provided_quote_token_balance}
            logoURI={quote_token.logoURI}
            symbol={quote_token.symbol}
          />
        </Column>
        <Inline css={{ paddingBottom: '$12' }}>
          {didProvideLiquidity && (
            <Button
              variant="secondary"
              size="large"
              state={cardInteractionState}
              css={{ width: '100%' }}
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
            >
              Manage Liquidity
            </Button>
          )}
          {!didProvideLiquidity && (
            <Button
              variant="primary"
              size="large"
              state={cardInteractionState}
              css={{ width: '100%' }}
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
            >
              Add Liquidity
            </Button>
          )}
        </Inline>
      </CardContent>
    </Card>
  )
}
