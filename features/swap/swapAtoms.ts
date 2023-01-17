import { atom } from 'recoil'

export type TokenItemState = {
  symbol: string
  amount: number
  swap_address: string
}

export type TokenSwapState = {
  input_token: TokenItemState,
  output_token: TokenItemState,
}


// TODO extend this property to contain more info about swap
export const tokenSwapAtom = atom<TokenSwapState>({
  key: 'tokenSwap',
  default: {
    input_token: {
      symbol: null,
      swap_address: null,
      amount: 0
    },
    output_token: {
      symbol: null,
      swap_address: null,
      amount: 0,
    },
  },
  effects_UNSTABLE: [
    function validateIfTokensAreSame({ onSet, setSelf }) {
      onSet((newValue, oldValue) => {
        const { input_token, output_token } = newValue

        if (input_token.symbol === output_token.symbol) {
          requestAnimationFrame(() => {
            setSelf(oldValue)
          })
        }
      })
    },
  ],
})

export const slippageAtom = atom<number>({
  key: 'slippageForSwap',
  default: 0.01,
})
