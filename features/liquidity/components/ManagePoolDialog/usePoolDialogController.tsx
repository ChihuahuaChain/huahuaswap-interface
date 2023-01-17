import { useRefetchQueries } from 'hooks/useRefetchQueries'
import { useSwapInfo } from 'hooks/useSwapInfo'
import { useTokenBalance } from 'hooks/useTokenBalance'
import {
  Button,
  Error,
  IconWrapper,
  protectAgainstNaN,
  Toast,
  UpRightArrow,
  Valid,
} from 'junoblocks'
import { PoolEntityTypeWithLiquidity } from 'queries/useQueryPools'
import { toast } from 'react-hot-toast'
import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'
import { executeAddLiquidity, executeRemoveLiquidity } from 'services/liquidity'
import { walletState } from 'state/atoms/walletAtoms'
import {
  convertDenomToMicroDenom,
} from 'util/conversion'
import { formatSdkErrorMessage } from 'util/formatSdkErrorMessage'
import { POOL_TOKENS_DECIMALS } from 'util/constants'

type UsePoolDialogControllerArgs = {
  /* value from 0 to 1 */
  percentage: number
  actionState: 'add' | 'remove'
  pool: PoolEntityTypeWithLiquidity
}

function calculate_max_applicable_balances(
  base_token_balance: number,
  quote_token_balance: number,
  pool_price: number,
) {
  // TODO: Get tx fees and slippage from config
  const slippage = 1 // defaults to 1%
  const tx_fee = 1   // defaults to 1huahua

  // Deduct tx_fee from base_token_balance
  base_token_balance = Math.max(base_token_balance - tx_fee, 0);

  if (pool_price > 0 && base_token_balance > 0 && quote_token_balance > 0) {
    // Apply slippage to pool_price
    pool_price = pool_price + (pool_price * slippage / 100)

    let quote_amount_to_use = pool_price * base_token_balance
    let is_limiting = quote_amount_to_use > quote_token_balance

    if (is_limiting) {
      base_token_balance = quote_token_balance / pool_price
    } else {
      quote_token_balance = quote_amount_to_use
    }
  }

  return {
    base: base_token_balance,
    quote: quote_token_balance,
  }
}

export const usePoolDialogController = ({
  actionState,
  percentage,
  pool,
}: UsePoolDialogControllerArgs) => {
  const { liquidity, pool_assets } = pool

  // Note: This is the current user's balances of tokens with the same symbol
  // as those contained in the given pool.
  const { balance: base_token_balance } = useTokenBalance(pool_assets.base.symbol)
  const { balance: quote_token_balance } = useTokenBalance(pool_assets.quote.symbol)

  // Calculate how much of the base_token and quote token can be used
  // after the current slippage and transaction fee is applied
  const pool_price = protectAgainstNaN(liquidity.quote_reserve / liquidity.base_reserve)
  const {
    base: max_applicable_balance_for_base,
    quote: max_applicable_balance_for_quote,
  } = calculate_max_applicable_balances(
    base_token_balance,
    quote_token_balance,
    pool_price
  )

  // Here is the action to apply when mutating liquidity
  const { isLoading, mutate: mutate_liquidity } = useMutateLiquidity({
    actionState,
    pool,
    percentage,
    max_applicable_balance_for_base,
    max_applicable_balance_for_quote,
  })

  return {
    state: {
      base_token_balance,
      quote_token_balance,
      max_applicable_balance_for_base,
      max_applicable_balance_for_quote,
      pool_price,
      isLoading,
    },
    actions: {
      mutate_liquidity,
    },
  }
}

const useMutateLiquidity = ({
  pool,
  percentage,
  max_applicable_balance_for_base,
  max_applicable_balance_for_quote,
  actionState,
}) => {
  const { liquidity, pool_assets } = pool as PoolEntityTypeWithLiquidity
  const { address, client } = useRecoilValue(walletState)
  const refetchQueries = useRefetchQueries(['tokenBalance'])

  const [swap] = useSwapInfo({
    poolId: pool.pool_id,
  })

  const mutation = useMutation(
    async () => {
      const { lp_token_address } = swap

      if (actionState === 'add') {
        const base_amount_to_add = percentage * max_applicable_balance_for_base
        const quote_amount_to_add = percentage * max_applicable_balance_for_quote

        return executeAddLiquidity({
          base_token_info: pool_assets.base,
          quote_token_info: pool_assets.quote,
          base_amount_to_add: convertDenomToMicroDenom(base_amount_to_add, POOL_TOKENS_DECIMALS),
          quote_amount_to_add: convertDenomToMicroDenom(quote_amount_to_add, POOL_TOKENS_DECIMALS),
          swap_address: pool.swap_address,
          sender_address: address,
          client,
        })
      } else {
        const lp_amount_to_remove = Math.floor(percentage * liquidity.provided_lp_amount)
        const lp_ratio = lp_amount_to_remove / liquidity.total_lp_amount
        const min_base_token_output = lp_ratio * liquidity.base_reserve
        const min_quote_token_output = lp_ratio * liquidity.quote_reserve

        return executeRemoveLiquidity({
          lp_amount_to_remove: convertDenomToMicroDenom(lp_amount_to_remove, POOL_TOKENS_DECIMALS),
          min_base_token_output: convertDenomToMicroDenom(min_base_token_output, POOL_TOKENS_DECIMALS),
          min_quote_token_output: convertDenomToMicroDenom(min_quote_token_output, POOL_TOKENS_DECIMALS),
          swap_address: pool.swap_address,
          sender_address: address,
          lp_token_address,
          client,
        })
      }
    },
    {
      onSuccess() {
        // show toast
        toast.custom((t) => (
          <Toast
            icon={<IconWrapper icon={<Valid />} color="valid" />}
            title={`${actionState === 'add' ? 'Add' : 'Remove'} Successful`}
            onClose={() => toast.dismiss(t.id)}
          />
        ))

        refetchQueries()
        setTimeout(mutation.reset, 350)
      },
      onError(e) {
        console.error(e)

        toast.custom((t) => (
          <Toast
            icon={<IconWrapper icon={<Error />} color="error" />}
            title={`Couldn't ${actionState === 'add' ? 'Add' : 'Remove'
              } liquidity`}
            body={formatSdkErrorMessage(e)}
            buttons={
              <Button
                as="a"
                variant="ghost"
                href={process.env.NEXT_PUBLIC_FEEDBACK_LINK}
                target="__blank"
                iconRight={<UpRightArrow />}
              >
                Provide feedback
              </Button>
            }
            onClose={() => toast.dismiss(t.id)}
          />
        ))
      },
    }
  )

  return mutation
}
