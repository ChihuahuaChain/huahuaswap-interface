import { GasPrice, SigningStargateClient } from '@cosmjs/stargate'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'
import { getOfflineSigner } from '@cosmostation/cosmos-client'
import { ibcWalletState, WalletStatusType } from '../state/atoms/walletAtoms'
import { GAS_PRICE } from '../util/constants'
import { useIBCAssetInfo } from './useIBCAssetInfo'
import { useLocalStorage } from '@rehooks/local-storage'

/* shares very similar logic with `useConnectWallet` and is a subject to refactor */
export const useConnectIBCWallet = (
  tokenSymbol: string,
  mutationOptions?: Parameters<typeof useMutation>[2]
) => {
  const [{ status, tokenSymbol: storedTokenSymbol }, setWalletState] =
    useRecoilState(ibcWalletState)
  const assetInfo = useIBCAssetInfo(tokenSymbol || storedTokenSymbol)
  const [selectedWalletType] = useLocalStorage('selectedWalletType')

  const mutation = useMutation(async () => {
    /* set the fetching state */
    setWalletState((value) => ({
      ...value,
      tokenSymbol,
      client: null,
      state: WalletStatusType.connecting,
    }))

    if (!tokenSymbol && !storedTokenSymbol) {
      throw new Error(
        'You must provide `tokenSymbol` before connecting to the wallet.'
      )
    }

    if (!assetInfo) {
      throw new Error(
        'Asset info for the provided `tokenSymbol` was not found. Check your internet connection.'
      )
    }

    const useKeplr = async () => {
      if (window && !window?.keplr) {
        alert('Please install Keplr extension and refresh the page.')
        return
      }
      try {
        await window.keplr.enable(assetInfo.chain_id)

        const offlineSigner = await window.getOfflineSignerAuto(
          assetInfo.chain_id
        )
        const wasmChainClient = await SigningStargateClient.connectWithSigner(
          assetInfo.rpc,
          offlineSigner,
          {
            gasPrice: GasPrice.fromString(GAS_PRICE),
          }
        )

        const [{ address }] = await offlineSigner.getAccounts()

        /* successfully update the wallet state */
        setWalletState({
          tokenSymbol,
          address,
          client: wasmChainClient,
          status: WalletStatusType.connected,
        })
      } catch (e) {
        /* set the error state */
        setWalletState({
          tokenSymbol: null,
          address: '',
          client: null,
          status: WalletStatusType.error,
        })

        throw e
      }
    };

    const useCosmostation = async () => {
      if (window && !window?.cosmostation) {
        alert('Please install cosmostation extension')
        return
      }

      try {
        const offlineSigner = await getOfflineSigner(assetInfo.chain_id)
        const wasmChainClient = await SigningStargateClient.connectWithSigner(
          assetInfo.rpc,
          offlineSigner,
          {
            gasPrice: GasPrice.fromString(GAS_PRICE),
          }
        )

        const accout = await window.cosmostation.cosmos.request({
          method: 'cos_requestAccount',
          params: { chainName: assetInfo.id },
        })

        // successfully update the wallet state
        setWalletState({
          tokenSymbol,
          address: accout.address,
          client: wasmChainClient,
          status: WalletStatusType.connected,
        })
      } catch (e) {
        /* set the error state */
        setWalletState({
          tokenSymbol: null,
          address: '',
          client: null,
          status: WalletStatusType.error,
        })

        throw e
      }
    }

    switch (selectedWalletType) {
      case 'keplr': {
        if (assetInfo) {
          await useKeplr()
        }
        break
      }
      case 'ibc_wallet': {
        if (assetInfo) {
          await useCosmostation()
        }
        break
      }
      default: {
        break
      }
    }
  }, mutationOptions)

  const connectWallet = mutation.mutate

  useEffect(() => {
    /* restore wallet connection */
    if (status === WalletStatusType.restored && assetInfo) {
      connectWallet(null)
    }
  }, [status, connectWallet, assetInfo])

  useEffect(() => {
    function reconnectWallet() {
      if (assetInfo && status === WalletStatusType.connected) {
        connectWallet(null)
      }
    }

    window.addEventListener('keplr_keystorechange', reconnectWallet)
    return () => {
      window.removeEventListener('keplr_keystorechange', reconnectWallet)
    }
  }, [connectWallet, status, assetInfo])

  useEffect(
    function listenToWalletAddressChangeInKeplr() {
      function reconnectWallet() {
        if (status === WalletStatusType.connected) {
          mutation.mutate(null)
        }
      }

      window?.cosmostation?.cosmos.on('accountChanged', () => reconnectWallet)
      return () => { }
    },
    // eslint-disable-next-line
    [connectWallet, status, assetInfo]
  )

  return mutation
}
