interface Window {
	WalletLinkProvider?: never;
	walletLinkExtension?: never;
	ethereum?: {
		isCoinbaseWallet?: boolean;
		isMetaMask?: true;
		selectedAddress?: string;
		// isMathWallet?: true
		on?: (...args: never[]) => void;
		removeListener?: (...args: never[]) => void;
	};
	web3?: unknown;
}
