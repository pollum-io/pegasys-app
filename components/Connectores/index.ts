import { InjectedConnector } from '@pollum-io/pegasys-injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

const NETWORK_URL = process.env.NODE_ENV

if (typeof NETWORK_URL === 'undefined') {
    throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
  }

export const injected = new InjectedConnector({
    supportedChainIds: [5700, 57]
})

export const walletlink = new WalletLinkConnector({
    url: NETWORK_URL,
    appName: 'Pegasys',
    appLogoUrl: 'https://raw.githubusercontent.com/pollum-io/pegasys-tokens/master/tokens/0x32f8199e428117F5A037A56562bbBFca7d5328c9/logo.png'

})

export const walletconnect = new WalletConnectConnector({
    rpc: {
        57: NETWORK_URL
    },
    qrcode: true,
    bridge: 'https://bridge.walletconnect.org/'
})

