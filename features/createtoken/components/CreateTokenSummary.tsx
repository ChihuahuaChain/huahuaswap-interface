import { Button, styled, Text, UpRightArrow } from 'junoblocks'

type CreateTokenSummaryProps = {
    data: any,
    onBack: () => void
}

export const CreateTokenSummary = ({
    data,
    onBack,
}: CreateTokenSummaryProps) => {
    return (
        <>
            <Button
                css={{ paddingLeft: '0' }}
                as="a"
                variant="ghost"
                href={process.env.NEXT_PUBLIC_BLOCK_EXPLORER + data?.transactionHash}
                target="__blank"
                iconRight={<UpRightArrow />}
            >
                <Text variant="primary">TransactionHash: {data?.transactionHash}</Text>
            </Button>

            <Text variant="primary">ContractAddress: {data?.contractAddress}</Text>
            <Text css={{ marginTop: "$8" }} variant="primary">Token Info</Text>

            <StyledDivForWrapper>
                <pre>
                    <code>
                        <Text variant="primary">{JSON.stringify(data?.info, null, 4)}</Text>
                    </code>
                </pre>
            </StyledDivForWrapper>

            <Button
                variant="primary"
                size="large"
                onClick={onBack}
            >
                {'Back'}
            </Button>
        </ >
    )
}

const StyledDivForWrapper = styled('div', {
    borderRadius: '8px',
    backgroundColor: '$colors$dark10',
    marginTop: '$4',
    marginBottom: '$32',
    padding: '8px'
})