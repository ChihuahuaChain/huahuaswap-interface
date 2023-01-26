import { useTokenList } from 'hooks/useTokenList'
import { styled, useMedia } from 'junoblocks'
import { useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { NETWORK_FEE } from 'util/constants'
import { usePoolsListQuery } from 'queries/usePoolsListQuery'
import { TokenItemState, tokenSwapAtom, slippageAtom } from '../swapAtoms'
import { TokenSelector } from './TokenSelector'
import { TransactionAction } from './TransactionAction'
import { TransactionTips } from './TransactionTips'
import { PoolEntityTypeWithLiquidity, useQueryMultiplePoolsLiquidity } from 'queries/useQueryPools'
import { useQueriesDataSelector } from 'hooks/useQueriesDataSelector'
import {
  TransactionStatus,
  transactionStatusState,
} from 'state/atoms/transactionAtoms'

type TokenSwapModuleProps = {
  /* will be used if provided on first render instead of internal state */
  initialTokenPair?: readonly [string, string]
}

export const TokenSwapModule = ({ initialTokenPair }: TokenSwapModuleProps) => {
  const [{ input_token, output_token }, setTokenSwapState] = useRecoilState(tokenSwapAtom)
  const slippage = useRecoilValue(slippageAtom)
  const [tokenList, isTokenListLoading] = useTokenList()
  const transactionStatus = useRecoilValue(transactionStatusState)
  const initialTokenPairValue = useRef(initialTokenPair).current
  const { data: poolsListResponse } = usePoolsListQuery()

  // Query PoolEntityTypeWithLiquidity[] for matching_pools_for_swap
  const [pools, is_loading_pools_with_liquidity] = useQueriesDataSelector(
    useQueryMultiplePoolsLiquidity({
      refetchInBackground: false,
      pools: poolsListResponse?.pools,
    })
  )

  useEffect(() => {
    // compute output amount
    if (!is_loading_pools_with_liquidity && Boolean(pools?.length)) {
      const { output_amount, input_amm_address, output_amm_address } = compute_output_amount(input_token, output_token.symbol);

      setTokenSwapState({
        input_token: { ...input_token, swap_address: input_amm_address },
        output_token: { ...output_token, amount: output_amount, swap_address: output_amm_address }
      })
    }

  }, [slippage])

  useEffect(() => {
    const shouldSetDefaultTokenAState =
      !input_token.symbol && !output_token.symbol && Boolean(tokenList)

    if (shouldSetDefaultTokenAState) {
      setTokenSwapState({
        input_token: {
          ...input_token,
          symbol: tokenList.base_token.symbol,
        },
        output_token,
      })
    }
  }, [tokenList, isTokenListLoading, input_token, output_token])

  useEffect(() => {
    if (Boolean(initialTokenPairValue) && Boolean(tokenList)) {
      const [input_symbol, output_symbol] = initialTokenPairValue
      // Check to make sure that input_symbol and output_symbol
      // are valid tokens in the tokenList
      let all_token_symbols = tokenList.tokens.map(t => t.symbol);
      let valid_tokens = initialTokenPairValue.filter(x => all_token_symbols.includes(x))

      if (valid_tokens.length === 2) {
        setTokenSwapState({
          input_token: {
            ...input_token,
            symbol: input_symbol,
            amount: 0,
          },
          output_token: {
            ...output_token,
            symbol: output_symbol,
            amount: 0,
          }
        });
      }
    }
  },
    [tokenList, isTokenListLoading, initialTokenPairValue]
  )

  // Check if the UI should be enabled
  const isUiDisabled =
    transactionStatus === TransactionStatus.EXECUTING
    || isTokenListLoading
    || is_loading_pools_with_liquidity

  const uiSize = useMedia('sm') ? 'small' : 'large'

  function handleSwapTokenPosition() {
    setTokenSwapState({
      output_token: { ...input_token, amount: 0 },
      input_token: { ...output_token, amount: 0 },
    })
  }

  function handle_input_change(updated_input: TokenItemState) {
    let current_input = input_token;
    let current_output = output_token;
    let did_change = true

    if (updated_input.symbol !== current_input.symbol && updated_input.symbol !== current_output.symbol) {
      current_input = { ...updated_input, amount: 0 }
      current_output = { ...current_output, amount: 0 }
    } else if (updated_input.amount !== current_input.amount) {
      current_input = updated_input;

      // compute output_amount
      const { output_amount, input_amm_address, output_amm_address } = compute_output_amount(current_input, current_output.symbol);
      current_output = { ...current_output, amount: output_amount, swap_address: output_amm_address }
      current_input = { ...current_input, swap_address: input_amm_address }
    } else {
      did_change = false
    }

    if (did_change) {
      setTokenSwapState({
        input_token: current_input,
        output_token: current_output
      })
    }
  }

  // using q = Qb / (B + b), where 
  // q = output_amount, 
  // Q = output_reserve
  // b = input_amount
  // B = input_reserve
  function calculate_output_amount_for_swap(
    input_amount: number,
    input_reserve: number,
    output_reserve: number
  ): number {
    let output_amount = (output_reserve * input_amount) / (input_reserve + input_amount)

    // deduct NETWORK_FEE from output
    output_amount = output_amount - (output_amount * NETWORK_FEE)

    // deduct slippage from output
    output_amount = output_amount - (output_amount * slippage)

    return output_amount
  }

  function get_reserves_for_swap(
    pool: PoolEntityTypeWithLiquidity,
    output_token_symbol: string
  ): { input_reserve: number, output_reserve: number } {
    const { pool_assets, liquidity } = pool
    const is_output_base = pool_assets.base.symbol === output_token_symbol

    return {
      input_reserve: is_output_base ? liquidity.quote_reserve : liquidity.base_reserve,
      output_reserve: is_output_base ? liquidity.base_reserve : liquidity.quote_reserve
    }
  }

  function compute_output_amount(
    input_token: TokenItemState,
    output_token_symbol: string
  ): { output_amount: number, input_amm_address: string, output_amm_address: string } {
    // filter matching pools for swap
    const matching_pools = pools.filter(
      p => p.pool_assets.quote.symbol === output_token_symbol
        || p.pool_assets.quote.symbol === input_token.symbol
    )

    let output_amount = 0;
    let input_amm_address = '';
    let output_amm_address = '';

    if (matching_pools.length === 1) {
      const swap_pool = matching_pools[0]

      const { input_reserve, output_reserve } = get_reserves_for_swap(
        swap_pool,
        output_token_symbol
      )
      output_amount = calculate_output_amount_for_swap(
        input_token.amount,
        input_reserve,
        output_reserve
      )

      // update input_amm_address
      input_amm_address = swap_pool.swap_address
    } else if (matching_pools.length === 2) {
      // matching_pools_by_quote_token_symbol
      const matching_pools_by_quote_token_symbol = {}
      matching_pools.forEach(p => {
        const symbol = p.pool_assets.quote.symbol;
        matching_pools_by_quote_token_symbol[symbol] = p
      })

      const input_swap_pool = matching_pools_by_quote_token_symbol[input_token.symbol] as PoolEntityTypeWithLiquidity
      const output_swap_pool = matching_pools_by_quote_token_symbol[output_token_symbol] as PoolEntityTypeWithLiquidity
      const intermediate_token_symbol = input_swap_pool.pool_assets.base.symbol

      // get intermediate_base_output from input_swap_pool
      const { input_reserve, output_reserve } = get_reserves_for_swap(
        input_swap_pool,
        intermediate_token_symbol
      )
      const intermediate_base_output = calculate_output_amount_for_swap(
        input_token.amount,
        input_reserve,
        output_reserve
      )

      // then use intermediate_base_output from input_swap_pool to get output_amount from output_swap_pool
      const { input_reserve: A, output_reserve: B } = get_reserves_for_swap(
        output_swap_pool,
        output_token_symbol
      )
      output_amount = calculate_output_amount_for_swap(
        intermediate_base_output,
        A,
        B
      )

      // update input_amm_address and output_amm_address
      input_amm_address = input_swap_pool.swap_address
      output_amm_address = output_swap_pool.swap_address
    }

    return {
      output_amount,
      input_amm_address,
      output_amm_address
    };
  }

  function handle_output_token_change(updated_output: TokenItemState) {
    if (updated_output.symbol !== output_token.symbol && updated_output.symbol !== input_token.symbol) {
      // compute output amount
      const { output_amount, input_amm_address, output_amm_address } = compute_output_amount(input_token, updated_output.symbol);

      setTokenSwapState({
        input_token: { ...input_token, swap_address: input_amm_address },
        output_token: { ...updated_output, amount: output_amount, swap_address: output_amm_address }
      })
    }
  }

  return (
    <>
      <StyledDivForWrapper>
        <TokenSelector
          token_symbol={input_token.symbol}
          amount={input_token.amount}
          onChange={handle_input_change}
          disabled={isUiDisabled}
          size={uiSize}
        />
        <TransactionTips
          disabled={isUiDisabled}
          onTokenSwaps={handleSwapTokenPosition}
          size={uiSize}
        />
        <TokenSelector
          readOnly
          token_symbol={output_token.symbol}
          amount={output_token.amount}
          onChange={handle_output_token_change}
          disabled={isUiDisabled}
          size={uiSize}
        />
      </StyledDivForWrapper>

      <TransactionAction
        size={uiSize}
      />
    </>
  )
}

const StyledDivForWrapper = styled('div', {
  borderRadius: '8px',
  backgroundColor: '$colors$dark10',
})
