import { AppLayout, NavigationSidebar } from 'components'
import {
  LiquidityBreakdown,
  LiquidityHeader,
  ManageLiquidityCard,
  ManagePoolDialog,
} from 'features/liquidity'
import {
  Button,
  ChevronIcon,
  Divider,
  Inline,
  media,
  Spinner,
  styled,
  Text,
  useMedia,
} from 'junoblocks'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQueryPoolLiquidity } from 'queries/useQueryPools'
import React, { useState } from 'react'
import {
  APP_NAME,
} from 'util/constants'

export default function Pool() {
  const {
    query: { pool: poolId },
  } = useRouter()

  const [
    { isShowing: isManageLiquidityDialogShowing, actionType },
    setManageLiquidityDialogState,
  ] = useState({ isShowing: false, actionType: 'add' as 'add' | 'remove' })

  const isMobile = useMedia('sm')
  const [pool, isLoading, isError] = useQueryPoolLiquidity({ poolId })
  const { base: base_token, quote: quote_token } = pool?.pool_assets
  const isLoadingInitial = isLoading && !pool

  if (!pool || !poolId) {
    return (
      <Inline
        align="center"
        justifyContent="center"
        css={{ padding: '$10', height: '100vh' }}
      >
        {isError ? (
          <Text variant="header">
            {"Oops, we've messed up. Please try again later."}
          </Text>
        ) : (
          <Spinner color="primary" />
        )}
      </Inline>
    )
  }

  return (
    <>
      <ManagePoolDialog
        isShowing={isManageLiquidityDialogShowing}
        initialActionType={actionType}
        onRequestClose={() =>
          setManageLiquidityDialogState({
            isShowing: false,
            actionType: 'add',
          })
        }
        poolId={poolId as string}
      />

      {pool && (
        <Head>
          <title>
            {APP_NAME} — Pool {base_token.symbol}/{quote_token.symbol}
          </title>
        </Head>
      )}

      <AppLayout
        navigationSidebar={
          <NavigationSidebar
            shouldRenderBackButton={isMobile}
            backButton={
              <Link href="/pools" passHref>
                <Button as="a" variant="ghost" icon={<ChevronIcon />} />
              </Link>
            }
          />
        }>

        <LiquidityHeader
          base_token={base_token}
          quote_token={quote_token}
          size={isMobile ? 'small' : 'large'}
        />

        {!isMobile && <Divider />}

        {isLoadingInitial && (
          <StyledDivForSpinner>
            <Spinner color="primary" size={32} />
          </StyledDivForSpinner>
        )}

        {!isLoadingInitial && (
          <>
            <LiquidityBreakdown
              poolId={poolId as string}
              base_token={base_token}
              quote_token={quote_token}
              liquidity={pool.liquidity}
              size={isMobile ? 'small' : 'large'}
            />
            <>
              <StyledDivForCards>
                <ManageLiquidityCard
                  base_token={base_token}
                  quote_token={quote_token}
                  liquidity={pool.liquidity}
                  onClick={() => {
                    setManageLiquidityDialogState({
                      isShowing: true,
                      actionType: 'add',
                    })
                  }}
                />
              </StyledDivForCards>
            </>
          </>
        )}
      </AppLayout>
    </>
  )
}

const StyledDivForCards = styled('div', {
  display: 'grid',
  columnGap: '$8',
  gridTemplateColumns: '1fr 1fr 1fr',
  [media.sm]: {
    gridTemplateColumns: '1fr',
    rowGap: '$8',
  },
})

const StyledDivForSpinner = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 143,
})
