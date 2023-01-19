import { CSS } from '@stitches/react'
import { Logo } from 'icons'
import { ConnectIcon, IconWrapper, styled, Text } from 'junoblocks'
import { useRecoilValue } from 'recoil'
import { ibcWalletState, walletState } from 'state/atoms/walletAtoms'
import { APP_NAME } from 'util/constants'
import { useLocalStorage } from '@rehooks/local-storage'

type WalletInfoProps = {
  label: any
  icon: any
  address: string
  css: any
}

export const WalletInfo = ({ label, icon, address, css }: WalletInfoProps) => {
  function truncate(fullStr, strLen, separator) {
    if (fullStr.length <= strLen) return fullStr;

    separator = separator || '...';

    var sepLen = separator.length,
      charsToShow = strLen - sepLen,
      frontChars = Math.ceil(charsToShow / 2),
      backChars = Math.floor(charsToShow / 2);

    return fullStr.substr(0, frontChars) +
      separator +
      fullStr.substr(fullStr.length - backChars);
  }

  return (
    <StyledDivForWrapper css={css}>
      {icon}
      <div>
        <Text variant="primary">{label}</Text>
        <StyledDivForAddressRow>
          <ConnectIcon color="secondary" size="medium" />
          <Text truncate={true} variant="legend">
            {truncate(address, 40, '...') || "address wasn't identified yet"}
          </Text>
        </StyledDivForAddressRow>
      </div>
    </StyledDivForWrapper>
  )
}

type WalletTypeProps = {
  css?: CSS
  depositing?: boolean
}

export const externalWalletInfo = ({ css, depositing }: WalletTypeProps) => {
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
      label={`${depositing ? 'From ' : 'To'} Address`}
      icon={iconImg}
      address={ibcWalletAddress}
    />
  )
}

export const AppWalletInfo = ({ css, depositing }: WalletTypeProps) => {
  const { address: walletAddress } = useRecoilValue(walletState)

  return (
    <WalletInfo
      css={css}
      label={`${depositing ? 'To ' : 'From '}${APP_NAME}`}
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
