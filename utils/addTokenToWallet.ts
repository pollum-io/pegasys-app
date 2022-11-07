import { WrappedTokenInfo } from "types";

export const addTokenToWallet = async (token: WrappedTokenInfo) => {
	const { address, symbol, decimals, logoURI } = token;

	// eslint-disable-next-line
	// @ts-ignore
	const provider = window.ethereum;

	try {
		await provider?.request({
			method: "wallet_watchAsset",
			params: {
				type: "ERC20",
				options: {
					address,
					symbol,
					decimals,
					image: logoURI,
				},
			},
		});
	} catch (error) {
		console.log(error);
	}
};
