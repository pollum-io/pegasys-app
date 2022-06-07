interface Window {
	WalletLinkProvider?: any;
	walletLinkExtension?: any;
	ethereum?: {
		isCoinbaseWallet?: boolean;
		isMetaMask?: true;
		selectedAddress?: string;
		// isMathWallet?: true
		on?: (...args: any[]) => void;
		removeListener?: (...args: any[]) => void;
	};
	web3?: {};
}
