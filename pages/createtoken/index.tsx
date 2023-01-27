import { AppLayout, PageHeader } from 'components'
import { CreateTokenModule, CreateTokenSummary } from 'features/createtoken'
import { formatTokenBalance, styled } from 'junoblocks'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { createTokenStatusState } from 'state/atoms/transactionAtoms'
import { convertMicroDenomToDenom } from 'util/conversion'

export default function Home() {
  const createTokenStatus = useRecoilValue(createTokenStatusState)
  const setCreateTokenState = useSetRecoilState(createTokenStatusState)

  // Here we build the view content
  let viewContent = <></>

  if (!createTokenStatus) {
    const fee = formatTokenBalance(
      convertMicroDenomToDenom(process.env.NEXT_PUBLIC_TOKEN_CREATION_FEE, 6),
      { includeCommaSeparation: true }
    )
    const subtitle = [
      'Now you can create your own degen or meme token on Chihuahua,',
      `and it'll only cost you ${fee} $HUAHUA.`,
      `The best part? They'll be burned like a hot dog at a barbecue!`
    ].join(' ')

    viewContent = (
      <StyledContainer>
        <PageHeader
          title="Create Token"
          subtitle={`${subtitle}`}
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
