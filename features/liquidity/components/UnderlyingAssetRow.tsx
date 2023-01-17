import { useBaseTokenDollarValue } from 'hooks/useBaseTokenDollarValue'
import { useTokenInfo } from 'hooks/useTokenInfo'
import {
  Button,
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
  ImageForTokenLogo,
  InfoIcon,
  Inline,
  Text,
  Tooltip,
} from 'junoblocks'

type UnderlyingAssetRowProps = {
  provided_liquidity_in_usd: number,
  token_amount: number,
  logoURI: string,
  symbol: string
}

export const UnderlyingAssetRow = ({
  provided_liquidity_in_usd,
  token_amount,
  logoURI,
  symbol
}: UnderlyingAssetRowProps) => {
  const formatted_usd_val = dollarValueFormatterWithDecimals(
    provided_liquidity_in_usd,
    { includeCommaSeparation: true }
  )
  const infoTooltipLabel = `≈ $${formatted_usd_val} USD`

  return (
    <Inline justifyContent="space-between">
      <Inline gap={3}>
        <ImageForTokenLogo
          size="large"
          logoURI={logoURI}
          alt={symbol}
        />
        <Text variant="link">{symbol}</Text>
      </Inline>
      <Inline align="center" gap={4}>
        <Inline gap={6}>
          <Text variant="body">
            {formatTokenBalance(token_amount, { includeCommaSeparation: true })}
          </Text>
        </Inline>
        <Tooltip label={infoTooltipLabel} aria-label={infoTooltipLabel}>
          <Button
            variant="ghost"
            size="small"
            icon={<InfoIcon />}
            iconColor={token_amount ? 'secondary' : 'disabled'}
            disabled={!token_amount}
          />
        </Tooltip>
      </Inline>
    </Inline>
  )
}
