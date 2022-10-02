import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { GasPrice } from '@cosmjs/stargate'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'
import { walletState, WalletStatusType } from '../state/atoms/walletAtoms'
import { GAS_PRICE } from '../util/constants'
import { useChainInfo } from './useChainInfo'

// todo debug this: SyntaxError: Cannot use import statement outside a module
// import { getOfflineSigner } from '@cosmostation/cosmos-client'

export const useConnectWallet = (
  mutationOptions?: Parameters<typeof useMutation>[2]
) => {
  const [{ status }, setWalletState] = useRecoilState(walletState)
  const isKeplr = localStorage.getItem('selectedWalletType') === 'keplr';

  // todo: based on the selectedWalletType get the right chain info
  const [chainInfo] = useChainInfo()

  const mutation = useMutation(async () => {
    if (isKeplr) {
      if (window && !window?.keplr) {
        alert('Please install Keplr extension and refresh the page.')
        return
      }
    } else {
      if (window && !window?.cosmostation) {
        alert('Please install cosmostation extension')
        return
      }
    }

    /* set the fetching state */
    setWalletState((value) => ({
      ...value,
      client: null,
      state: WalletStatusType.connecting,
    }))

    if (isKeplr) {
      try {
        await window.keplr.experimentalSuggestChain(chainInfo)
        await window.keplr.enable(chainInfo.chainId)

        const offlineSigner = await window.getOfflineSignerAuto(chainInfo.chainId)
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
    } else {
      try {
        // todo suggest chihuahua to cosmostation

        /*const offlineSigner = await getOfflineSigner(chainInfo.chainId);
        const wasmChainClient = await SigningCosmWasmClient.connectWithSigner(
          chainInfo.rpc,
          offlineSigner,
          {
            gasPrice: GasPrice.fromString(GAS_PRICE),
          }
        )

        const account = await window.cosmostation.cosmos.request({
          method: "cos_account",
          params: { chainName: "chihuahua-1" },
        });

        // successfully update the wallet state 
        setWalletState({
          name: account.name,
          address: account.address,
          client: wasmChainClient,
          status: WalletStatusType.connected,
        })*/

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

  if (isKeplr) {
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
  } else {
    useEffect(
      function listenToWalletAddressChangeInKeplr() {
        function reconnectWallet() {
          if (status === WalletStatusType.connected) {
            mutation.mutate(null)
          }
        }

        window.cosmostation.cosmos.on("accountChanged", () => reconnectWallet);
      },
      // eslint-disable-next-line
      [status]
    )
  }

  return mutation
}
