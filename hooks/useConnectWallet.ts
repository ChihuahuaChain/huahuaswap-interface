import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { GasPrice } from '@cosmjs/stargate'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'
import { walletState, WalletStatusType } from '../state/atoms/walletAtoms'
import { GAS_PRICE } from '../util/constants'
import { useChainInfo } from './useChainInfo'
import { getOfflineSigner } from '@cosmostation/cosmos-client'
import { useLocalStorage } from '@rehooks/local-storage'

export const useConnectWallet = (
  mutationOptions?: Parameters<typeof useMutation>[2]
) => {
  const [{ status }, setWalletState] = useRecoilState(walletState)
  const [chainInfo] = useChainInfo()
  const [selectedWalletType] = useLocalStorage('selectedWalletType')

  const mutation = useMutation(async () => {
    /* set the fetching state */
    setWalletState((value) => ({
      ...value,
      client: null,
      state: WalletStatusType.connecting,
    }))

    const useKeplr = async () => {
      if (window && !window?.keplr) {
        alert('Please install Keplr extension and refresh the page.')
        return
      }

      try {
        await window.keplr.experimentalSuggestChain(chainInfo)
        await window.keplr.enable(chainInfo.chainId)

        const offlineSigner = await window.getOfflineSignerAuto(
          chainInfo.chainId
        )
        const wasmChainClient = await SigningCosmWasmClient.connectWithSigner(
          chainInfo.rpc,
          offlineSigner,
          {
            gasPrice: GasPrice.fromString(GAS_PRICE),
          }
        )

        const [{ address }] = await offlineSigner.getAccounts()
        const key = await window.keplr.getKey(chainInfo.chainId)

        /* successfully update the wallet state */
        setWalletState({
          name: key.name,
          address,
          client: wasmChainClient,
          status: WalletStatusType.connected,
        })
      } catch (e) {
        /* set the error state */
        setWalletState({
          name: '',
          address: '',
          client: null,
          status: WalletStatusType.error,
        })

        /* throw the error for the UI */
        throw e
      }
    }

    const useCosmostation = async () => {
      if (window && !window?.cosmostation) {
        alert('Please install cosmostation extension')
        return
      }

      try {
        const offlineSigner = await getOfflineSigner(chainInfo.chainId)
        const wasmChainClient = await SigningCosmWasmClient.connectWithSigner(
          chainInfo.rpc,
          offlineSigner,
          {
            gasPrice: GasPrice.fromString(GAS_PRICE),
          }
        )

        const accout = await window.cosmostation.cosmos.request({
          method: 'cos_requestAccount',
          params: { chainName: chainInfo.chainName },
        })

        // successfully update the wallet state
        setWalletState({
          name: accout.name,
          address: accout.address,
          client: wasmChainClient,
          status: WalletStatusType.connected,
        })
      } catch (e) {
        /* set the error state */
        setWalletState({
          name: '',
          address: '',
          client: null,
          status: WalletStatusType.error,
        })

        /* throw the error for the UI */
        throw e
      }
    }

    switch (selectedWalletType) {
      case 'keplr': {
        if (chainInfo) {
          await useKeplr()
        }

        break
      }
      case 'ibc_wallet': {
        if (chainInfo) {
          await useCosmostation()
        }

        break
      }
      default: {
        break
      }
    }
  }, mutationOptions)

  useEffect(
    function restoreWalletConnectionIfHadBeenConnectedBefore() {
      /* restore wallet connection if the state has been set with the */
      if (chainInfo?.rpc && status === WalletStatusType.restored) {
        mutation.mutate(null)
      }
    }, // eslint-disable-next-line
    [status, chainInfo?.rpc]
  )

  useEffect(
    function listenToWalletAddressChangeInKeplr() {
      function reconnectWallet() {
        if (status === WalletStatusType.connected) {
          mutation.mutate(null)
        }
      }

      window.addEventListener('keplr_keystorechange', reconnectWallet)
      return () => {
        window.removeEventListener('keplr_keystorechange', reconnectWallet)
      }
    },
    // eslint-disable-next-line
    [status]
  )

  useEffect(
    function listenToWalletAddressChangeInKeplr() {
      function reconnectWallet() {
        if (status === WalletStatusType.connected) {
          mutation.mutate(null)
        }
      }

      window?.cosmostation?.cosmos.on('accountChanged', () => reconnectWallet)
      return () => {}
    },
    // eslint-disable-next-line
    [status]
  )

  return mutation
}
