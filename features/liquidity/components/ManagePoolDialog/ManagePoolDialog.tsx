import { usePrevious } from '@reach/utils'
import { LiquidityInput } from 'components'
import {
  Button,
  Dialog,
  DialogButtons,
  DialogContent,
  DialogDivider,
  DialogHeader,
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
  IconWrapper,
  ImageForTokenLogo,
  PlusIcon,
  protectAgainstNaN,
  Spinner,
  styled,
  Text,
} from 'junoblocks'
import { useQueryPoolLiquidity } from 'queries/useQueryPools'
import { useEffect, useRef, useState } from 'react'
import { LiquidityInputSelector } from '../LiquidityInputSelector'
import { PercentageSelection } from '../PercentageSelection'
import { StateSwitchButtons } from '../StateSwitchButtons'
import { TokenToTokenRates } from './TokenToTokenRates'
import { usePoolDialogController } from './usePoolDialogController'
import { TokenInfo } from '../../../../queries/usePoolsListQuery'

type ManagePoolDialogProps = {
  isShowing: boolean
  initialActionType: 'add' | 'remove'
  onRequestClose: () => void
  poolId: string
}

export const ManagePoolDialog = ({
  isShowing,
  initialActionType,
  onRequestClose,
  poolId,
}: ManagePoolDialogProps) => {
  const [pool] = useQueryPoolLiquidity({ poolId })
  const { liquidity, pool_assets } = pool
  const [isAddingLiquidity, setAddingLiquidity] = useState(
    initialActionType !== 'remove'
  )

  const [addLiquidityPercent, setAddLiquidityPercent] = useState(0)
  const [removeLiquidityPercent, setRemoveLiquidityPercent] = useState(0)

  const {
    state: {
      base_token_balance,
      quote_token_balance,
      max_applicable_balance_for_base,
      max_applicable_balance_for_quote,
      pool_price,
      isLoading,
    },
    actions: { mutate_liquidity },
  } = usePoolDialogController({
    pool,
    actionState: isAddingLiquidity ? 'add' : 'remove',
    percentage: isAddingLiquidity
      ? addLiquidityPercent
      : removeLiquidityPercent,
  })

  const handleSubmit = () =>
    mutate_liquidity(null, {
      onSuccess() {
        requestAnimationFrame(onRequestClose)
        setRemoveLiquidityPercent(0)
        setAddLiquidityPercent(0)
      },
    })

  const canManageLiquidity = liquidity.base_reserve > 0
  useEffect(() => {
    if (!canManageLiquidity) {
      setAddingLiquidity((isAdding) => {
        return !isAdding ? true : isAdding
      })
    }
  }, [canManageLiquidity])

  /* update initial tab whenever dialog opens */
  const previousIsShowing = usePrevious(isShowing)
  useEffect(() => {
    const shouldUpdateInitialState =
      previousIsShowing !== isShowing && isShowing
    if (shouldUpdateInitialState) {
      setAddingLiquidity(initialActionType !== 'remove')
    }
  }, [initialActionType, previousIsShowing, isShowing])

  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose}>
      <DialogHeader paddingBottom={canManageLiquidity ? '$8' : '$12'}>
        <Text variant="header">Manage Liquidity</Text>
      </DialogHeader>

      {canManageLiquidity && (
        <>
          <DialogContent>
            <StateSwitchButtons
              activeValue={isAddingLiquidity ? 'add' : 'remove'}
              values={['add', 'remove']}
              onStateChange={(value) => {
                setAddingLiquidity(value === 'add')
              }}
            />
          </DialogContent>
          <DialogDivider offsetY="$8" />
        </>
      )}

      <DialogContent>
        <Text variant="body" css={{ paddingBottom: '$6' }}>
          Choose how much to {isAddingLiquidity ? 'add' : 'remove'}
        </Text>
      </DialogContent>

      {isAddingLiquidity && (
        <AddLiquidityContent
          pool_price={pool_price}
          base_token_symbol={pool_assets.base.symbol}
          quote_token_symbol={pool_assets.quote.symbol}
          base_token_balance={base_token_balance}
          quote_token_balance={quote_token_balance}
          max_applicable_balance_for_base={max_applicable_balance_for_base}
          max_applicable_balance_for_quote={max_applicable_balance_for_quote}
          liquidity_percentage={addLiquidityPercent}
          on_change_liquidity={setAddLiquidityPercent}
        />
      )}

      {!isAddingLiquidity && (
        <RemoveLiquidityContent
          base_token_info={pool_assets.base}
          quote_token_info={pool_assets.quote}
          base_reserve={liquidity.base_reserve}
          quote_reserve={liquidity.quote_reserve}
          provided_liquidity_in_usd={liquidity.provided_liquidity_in_usd}
          liquidity_percentage={removeLiquidityPercent}
          on_change_liquidity={setRemoveLiquidityPercent}
        />
      )}

      <DialogDivider offsetTop="$16" offsetBottom="$8" />

      <DialogButtons>
        <Button variant="secondary" onClick={onRequestClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={isLoading ? undefined : handleSubmit}
        >
          {isLoading ? (
            <Spinner instant={true} size={16} />
          ) : (
            <>{isAddingLiquidity ? 'Add' : 'Remove'} liquidity</>
          )}
        </Button>
      </DialogButtons>
    </Dialog>
  )
}

function AddLiquidityContent({
  pool_price,
  liquidity_percentage,
  base_token_symbol,
  quote_token_symbol,
  base_token_balance,
  quote_token_balance,
  max_applicable_balance_for_base,
  max_applicable_balance_for_quote,
  on_change_liquidity,
}) {
  const handle_base_token_amount_change = (input: number) => {
    const value = Math.min(input, max_applicable_balance_for_base)
    on_change_liquidity(protectAgainstNaN(value / max_applicable_balance_for_base))
  }

  const handle_quote_token_amount_change = (input: number) => {
    const value = Math.min(input, max_applicable_balance_for_quote)
    on_change_liquidity(protectAgainstNaN(value / max_applicable_balance_for_quote))
  }

  const handle_apply_max = () => {
    handle_base_token_amount_change(max_applicable_balance_for_base)
  }

  const base_amount_to_use = max_applicable_balance_for_base * liquidity_percentage
  const quote_amount_to_use = max_applicable_balance_for_quote * liquidity_percentage

  return (
    <DialogContent>
      <StyledDivForLiquidityInputs>
        <LiquidityInput
          tokenSymbol={base_token_symbol}
          availableAmount={base_token_balance}
          maxApplicableAmount={max_applicable_balance_for_base}
          amount={base_amount_to_use}
          onAmountChange={handle_base_token_amount_change}
        />
        <LiquidityInput
          tokenSymbol={quote_token_symbol}
          availableAmount={quote_token_balance}
          maxApplicableAmount={max_applicable_balance_for_quote}
          amount={quote_amount_to_use}
          onAmountChange={handle_quote_token_amount_change}
        />
      </StyledDivForLiquidityInputs>
      <StyledDivForTxRates>
        <TokenToTokenRates
          base_token_symbol={base_token_symbol}
          quote_token_symbol={quote_token_symbol}
          pool_price={pool_price}
        />
      </StyledDivForTxRates>
      <Button
        variant="secondary"
        onClick={handle_apply_max}
        iconLeft={<IconWrapper icon={<PlusIcon />} />}
      >
        Provide max liquidity
      </Button>
    </DialogContent>
  )
}

type RemoveLiquidityContentProps = {
  base_token_info: TokenInfo,
  quote_token_info: TokenInfo,
  base_reserve: number,
  quote_reserve: number,
  provided_liquidity_in_usd: number,
  liquidity_percentage: number,
  on_change_liquidity: (liquidity: number) => void
}

function RemoveLiquidityContent({
  base_token_info,
  quote_token_info,
  base_reserve,
  quote_reserve,
  provided_liquidity_in_usd,
  liquidity_percentage,
  on_change_liquidity,
}: RemoveLiquidityContentProps) {
  const percentageInputRef = useRef<HTMLInputElement>()
  useEffect(() => {
    percentageInputRef.current?.focus()
  }, [])

  const liquidity_to_remove_in_usd = provided_liquidity_in_usd * liquidity_percentage

  const handleChangeLiquidity = (value) => {
    on_change_liquidity(value / provided_liquidity_in_usd)
  }

  return (
    <>
      <DialogContent>
        <LiquidityInputSelector
          inputRef={percentageInputRef}
          maxLiquidity={provided_liquidity_in_usd}
          liquidity={liquidity_to_remove_in_usd}
          onChangeLiquidity={handleChangeLiquidity}
        />
        <StyledGridForDollarValueTxInfo>
          <Text variant="caption" color="tertiary" css={{ padding: '$6 0 $9' }}>
            Available liquidity: $
            {dollarValueFormatterWithDecimals(provided_liquidity_in_usd, {
              includeCommaSeparation: true,
            })}
          </Text>
          <Text variant="caption" color="tertiary" css={{ padding: '$6 0 $9' }}>
            ≈ ${' '}
            {dollarValueFormatterWithDecimals(liquidity_to_remove_in_usd, {
              includeCommaSeparation: true,
            })}
          </Text>
        </StyledGridForDollarValueTxInfo>
        <PercentageSelection
          maxLiquidity={provided_liquidity_in_usd}
          liquidity={liquidity_to_remove_in_usd}
          onChangeLiquidity={handleChangeLiquidity}
        />
      </DialogContent>
      <DialogDivider offsetY="$8" />
      <DialogContent>
        <Text variant="body" css={{ paddingBottom: '$7' }}>
          Removing
        </Text>
        <StyledDivForLiquiditySummary>
          <StyledDivForToken>
            <ImageForTokenLogo
              size="large"
              logoURI={base_token_info.logoURI}
              alt={base_token_info.name}
            />
            <Text variant="caption">
              {formatTokenBalance(base_reserve * liquidity_percentage)}{' '}
              {base_token_info.symbol}
            </Text>
          </StyledDivForToken>
          <StyledDivForToken>
            <ImageForTokenLogo
              size="large"
              logoURI={quote_token_info.logoURI}
              alt={quote_token_info.name}
            />
            <Text variant="caption">
              {formatTokenBalance(quote_reserve * liquidity_percentage)}{' '}
              {quote_token_info.symbol}
            </Text>
          </StyledDivForToken>
        </StyledDivForLiquiditySummary>
      </DialogContent>
    </>
  )
}

const StyledDivForTxRates = styled('div', {
  padding: '$7 0 $12',
})

const StyledDivForLiquidityInputs = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  rowGap: 8,
})

const StyledGridForDollarValueTxInfo = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
})

const StyledDivForLiquiditySummary = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: '$space$12',
})

const StyledDivForToken = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: '$space$4',
})
