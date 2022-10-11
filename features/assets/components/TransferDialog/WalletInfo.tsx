import { CSS } from '@stitches/react'
import { Logo } from 'icons'
import { ConnectIcon, IconWrapper, styled, Text } from 'junoblocks'
import { useRecoilValue } from 'recoil'
import { ibcWalletState, walletState } from 'state/atoms/walletAtoms'
import { APP_NAME } from 'util/constants'
import { useLocalStorage } from '@rehooks/local-storage'

export const WalletInfo = ({ label, icon, address, css }) => {
  return (
    <StyledDivForWrapper css={css}>
      {icon}
      <div>
        <Text variant="primary">{label}</Text>
        <StyledDivForAddressRow>
          <ConnectIcon color="secondary" size="medium" />
          <Text truncate={true} variant="legend">
            {address || "address wasn't identified yet"}
          </Text>
        </StyledDivForAddressRow>
      </div>
    </StyledDivForWrapper>
  )
}

type WalletInfoProps = {
  css?: CSS
  depositing?: boolean
}

export const externalWalletInfo = ({ css, depositing }: WalletInfoProps) => {
  const { address: ibcWalletAddress } = useRecoilValue(ibcWalletState)
  const [selectedWalletType] = useLocalStorage('selectedWalletType')
  let iconImg = <></>;

  switch (selectedWalletType) {
    case 'keplr': {
      iconImg = <StyledImgForIcon src="/img/keplr-icon.png" alt="Keplr wallet" />;
      break
    }
    case 'ibc_wallet': {
      iconImg = <StyledImgForIcon src="/img/ibc_wallet.png" alt="Cosmostation wallet" />;
      break
    }
    default: {
      break
    }
  }

  return (
    <WalletInfo
      css={css}
      label={`From address`}
      icon={iconImg}
      address={ibcWalletAddress}
    />
  )
}

export const AppWalletInfo = ({ css, depositing }: WalletInfoProps) => {
  const { address: walletAddress } = useRecoilValue(walletState)

  return (
    <WalletInfo
      css={css}
      label={`${depositing ? 'To ' : ''}${APP_NAME}`}
      icon={<IconWrapper color="secondary" size="big" icon={<Logo />} />}
      address={walletAddress}
    />
  )
}

const StyledDivForWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: '$space$10',
})

const StyledDivForAddressRow = styled('div', {
  columnGap: '$space$2',
  display: 'flex',
  alignItems: 'center',
})

const StyledImgForIcon = styled('img', {
  width: 32,
  height: 32,
})
