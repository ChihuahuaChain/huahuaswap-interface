import { AppLayout, PageHeader } from 'components'
import { CreateTokenModule } from 'features/createtoken'
import { styled } from 'junoblocks'
import React from 'react'



export default function Home() {
  return (
    <AppLayout>
      <StyledContainer>
        <PageHeader
          title="Create Token"
          subtitle={`Create CW20 token to use in HUAHUAswap.`}
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
