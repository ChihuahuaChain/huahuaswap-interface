import { useTokenInfo } from 'hooks/useTokenInfo'
import {
  Card,
  CardContent,
  Column,
  Divider,
  dollarValueFormatterWithDecimals,
  ImageForTokenLogo,
  Inline,
  styled,
  Text,
} from 'junoblocks'
import Link from 'next/link'
import { PoolEntityType, TokenInfo } from 'queries/usePoolsListQuery'
import { PoolLiquidityState } from 'queries/useQueryPools'
import { formatCompactNumber } from 'util/formatCompactNumber'

type PoolCardProps = {
  poolId: string,
  base_token: TokenInfo,
  quote_token: TokenInfo,
  liquidity: PoolLiquidityState
}

export const PoolCard = ({
  poolId,
  base_token,
  quote_token,
  liquidity,
}: PoolCardProps) => {
  const has_provided_liquidity = Boolean(liquidity.provided_lp_amount)
  const provided_liquidity_in_usd = has_provided_liquidity
    ? formatCompactNumber(liquidity.provided_liquidity_in_usd)
    : 0

  const total_liquidity_in_usd = formatCompactNumber(
    liquidity.total_liquidity_in_usd
  )

  return (
    <Link href={`/pools/${poolId}`} passHref>
      <Card variant="secondary" active={has_provided_liquidity} style={{ paddingBottom: "2em" }}>
        <CardContent size="medium">
          <Column align="center">
            <StyledDivForTokenLogos css={{ paddingTop: '$20' }}>
              <ImageForTokenLogo
                size="big"
                logoURI={base_token.logoURI}
                alt={base_token.symbol}
              />
              <ImageForTokenLogo
                size="big"
                logoURI={quote_token.logoURI}
                alt={quote_token.symbol}
              />
            </StyledDivForTokenLogos>
            <StyledTextForTokenNames
              variant="title"
              align="center"
              css={{ paddingTop: '$8' }}
            >
              {base_token.symbol} <span /> {quote_token.symbol}
            </StyledTextForTokenNames>
          </Column>
        </CardContent>
        <Divider offsetTop="$16" offsetBottom="$12" />
        <CardContent size="medium">
          <Column gap={3}>
            <Text variant="legend" color="secondary">
              Total liquidity
            </Text>
            <Text variant="primary">
              {has_provided_liquidity ? (
                <>
                  <StyledSpanForHighlight>
                    ${provided_liquidity_in_usd}{' '}
                  </StyledSpanForHighlight>
                  of ${total_liquidity_in_usd}
                </>
              ) : (
                <>${total_liquidity_in_usd}</>
              )}
            </Text>
          </Column>
        </CardContent>
      </Card>
    </Link>
  )
}

export const StyledDivForTokenLogos = styled('div', {
  display: 'flex',
  [`& ${ImageForTokenLogo}`]: {
    position: 'relative',
    zIndex: '$2',
    backgroundColor: '$white',
    '&:not(&:first-of-type)': {
      backgroundColor: 'transparent',
      marginLeft: '-0.25rem',
      zIndex: '$1',
    },
  },
})

const StyledTextForTokenNames: typeof Text = styled(Text, {
  paddingTop: '$3',
  paddingBottom: '$2',
  display: 'flex',
  alignItems: 'center',
  '& span': {
    width: 4,
    height: 4,
    margin: '0 $3',
    borderRadius: '50%',
    backgroundColor: '$textColors$primary',
  },
})

const StyledSpanForHighlight = styled('span', {
  display: 'inline',
  color: '$textColors$brand',
})
