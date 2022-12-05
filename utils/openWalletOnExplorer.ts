export const openWalletOnExplorer = (walletAddress: string) => {
	const syscoinNevmUrl = `https://explorer.syscoin.org/address/${walletAddress}/transactions`;

	window.open(syscoinNevmUrl, "_blank");
};
