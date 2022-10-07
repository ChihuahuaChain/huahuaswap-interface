import { AppLayout, PageHeader } from 'components'
import { CreateTokenModule, CreateTokenSummary } from 'features/createtoken'
import { styled } from 'junoblocks'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { createTokenStatusState } from 'state/atoms/transactionAtoms'

export default function Home() {
  const createTokenStatus = useRecoilValue(createTokenStatusState)
  const setCreateTokenState = useSetRecoilState(createTokenStatusState)

  // Here we build the view content
  let viewContent = <></>

  if (!createTokenStatus) {
    viewContent = (
      <StyledContainer>
        <PageHeader
          title="Create Token"
          subtitle={`Create your own token on Chihuahua for only 10,000 $HUAHUA!`}
        />
        <CreateTokenModule />
      </StyledContainer>
    )
  } else {
    viewContent = (
      <StyledContainer>
        <PageHeader
          title="Token Created!"
          subtitle={`Summary of newly created token`}
        />

        <CreateTokenSummary
          data={createTokenStatus}
          onBack={() => setCreateTokenState(null)}
        ></CreateTokenSummary>
      </StyledContainer>
    )
  }

  return <AppLayout>{viewContent}</AppLayout>
}

const StyledContainer = styled('div', {
  maxWidth: '53.75rem',
  margin: '0 auto',
})
