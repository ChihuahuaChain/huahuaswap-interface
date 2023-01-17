import {
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
  styled,
  Text,
} from 'junoblocks'

export const TokenToTokenRates = ({
  base_token_symbol,
  quote_token_symbol,
  pool_price,
}) => {
  return (
    <StyledDivForGrid active={false}>
      <Text variant="caption" color="disabled" wrap={false}>
        1 {base_token_symbol} ≈ {formatTokenBalance(pool_price)} {quote_token_symbol}
        {' ≈ '}$
        {dollarValueFormatterWithDecimals(0, {
          includeCommaSeparation: true,
        })}
      </Text>
      <Text variant="caption" color="disabled">
        $
        {dollarValueFormatterWithDecimals(0 * 2, {
          includeCommaSeparation: true,
        })}
      </Text>
    </StyledDivForGrid>
  )
}

const StyledDivForGrid = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  variants: {
    active: {
      true: {
        opacity: 1,
      },
      false: {
        opacity: 0,
      },
    },
  },
})
