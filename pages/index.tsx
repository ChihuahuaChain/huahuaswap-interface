import { AppLayout, PageHeader } from 'components'
import { TokenSwapModule } from 'features/swap'
import { styled } from 'junoblocks'

function getInitialTokenPairFromSearchParams() {
  const params = new URLSearchParams(location.search)
  const from = params.get('from')
  const to = params.get('to')
  return from && to ? ([from.toUpperCase(), to.toUpperCase()] as const) : undefined
}

export default function Home() {
  return (
    <AppLayout>
      <StyledContainer>
        <PageHeader
          title="Swap"
          subtitle={`Swap between your favorite assets.`}
        />
        <TokenSwapModule
          initialTokenPair={getInitialTokenPairFromSearchParams()}
        />
      </StyledContainer>
    </AppLayout>
  )
}

const StyledContainer = styled('div', {
  maxWidth: '53.75rem',
  margin: '0 auto',
})
