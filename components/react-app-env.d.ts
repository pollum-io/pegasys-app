/// <reference types="react-scripts" />

interface Window {
  WalletLinkProvider?: any
  walletLinkExtension?: any
  ethereum?: {
    isCoinbaseWallet?: boolean
    isMetaMask?: true
    // isMathWallet?: true
    on?: (...args: any[]) => void
    removeListener?: (...args: any[]) => void
  }
  web3?: {}
}
