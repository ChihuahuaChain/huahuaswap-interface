import { AppLayout, PageHeader } from 'components'
import { CreateTokenModule } from 'features/createtoken'
import { styled } from 'junoblocks'
import React from 'react'

import { APP_NAME } from 'util/constants'

function getInitialTokenPairFromSearchParams() {
  const params = new URLSearchParams(location.search)
  const from = params.get('from')
  const to = params.get('to')
  return from || to ? ([from, to] as const) : undefined
}

export default function Home() {
  return (
    <AppLayout>
      <StyledContainer>
        <PageHeader
          title="Create Token"
          subtitle={`Create CW20 token to use in huahuaswap.`}
        />
        <CreateTokenModule
        />
      </StyledContainer>
    </AppLayout>
  )
}

const StyledContainer = styled('div', {
  maxWidth: '53.75rem',
  margin: '0 auto',
})
