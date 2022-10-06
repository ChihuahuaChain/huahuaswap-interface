import {
  Button,
  Column,
  Dialog,
  DialogContent,
  DialogHeader,
  Divider,
  styled,
  Text,
} from 'junoblocks'

type WalletSelectDialogProps = {
  isShowing: boolean
  onWalletSelect: (walletType: string) => void
  onRequestClose: () => void
}

export const WalletSelectDialog = ({
  isShowing,
  onWalletSelect,
  onRequestClose,
}: WalletSelectDialogProps) => {
  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose}>
      <DialogHeader paddingBottom="$10">
        <Text variant="header">Connect Wallet</Text>
      </DialogHeader>
      <DialogContent css={{ paddingBottom: '$12' }}>
        <Column gap={4}>
          <Button
            iconLeft={
              <StyledImgForIcon src="/img/keplr-icon.png" alt="Keplr wallet" />
            }
            onClick={() => onWalletSelect('keplr')}
            size="large"
            variant="ghost"
          >
            <StyledDiv>Keplr</StyledDiv>
          </Button>

          <Divider />

          <Button
            iconLeft={
              <StyledImgForIcon
                src="/img/ibc_wallet.png"
                alt="Cosmostation wallet"
              />
            }
            onClick={() => onWalletSelect('ibc_wallet')}
            size="large"
            variant="ghost"
          >
            <StyledDiv>Cosmostation</StyledDiv>
          </Button>
        </Column>
      </DialogContent>
    </Dialog>
  )
}

const StyledImgForIcon = styled('img', {
  width: 32,
  height: 32,
})

const StyledDiv = styled('div', {
  fontSize: 18,
  paddingLeft: 20,
})
