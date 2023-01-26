type ApiResponse = Record<string, { usd: number }>

export const fetchDollarPriceByTokenId = debounce(
  async (tokenId: string): Promise<ApiResponse> => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`,
      {
        method: 'GET',
      }
    )

    return response.json()
  },
  100
)

function debounce<T extends (args: any) => Promise<any>>(
  getPromise: T,
  timeoutMs: number
) {
  let timeout
  let argsState = []
  let resolvers = []

  const debouncedPromise = (args: Parameters<T>) => {
    argsState.push(args)

    return new Promise((resolve, reject) => {
      resolvers.push([resolve, reject])

      clearTimeout(timeout)
      timeout = setTimeout(function resolvePromises() {
        const promise = getPromise([...argsState])
        resolvers.forEach((promiseResolvers) =>
          promise.then(...promiseResolvers)
        )

        resolvers = []
        argsState = []
      }, timeoutMs)
    })
  }

  return debouncedPromise as T
}
