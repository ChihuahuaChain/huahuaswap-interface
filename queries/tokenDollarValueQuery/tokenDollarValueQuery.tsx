import { TokenInfo } from 'queries/usePoolsListQuery'

import { fetchDollarPriceByTokenId } from './fetchDollarPriceByTokenId'
import { pricingServiceIsDownAlert } from './pricingServiceIsDownAlert'

export async function tokenDollarValueQuery(token_id: TokenInfo['id']) {
  try {
    const prices = await fetchDollarPriceByTokenId(token_id)
    return prices[token_id]?.usd || 0
  } catch (e) {
    pricingServiceIsDownAlert()
    throw e
  }
}
