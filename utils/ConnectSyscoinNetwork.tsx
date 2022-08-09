import {
	SYS_TESTNET_CHAIN_PARAMS,
	NEVM_CHAIN_PARAMS,
	SUPPORTED_NETWORK_CHAINS,
} from "helpers/consts";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { convertHexToNumber } from "./index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

export const ConnectSyscoinNetwork = async (
	connector: AbstractConnector,
	setWalletError: React.Dispatch<React.SetStateAction<boolean>>,
	currentNetworkChainId: number
) => {
	// const convertedChainIdToNumber = convertHexToNumber(
	// 	NEVM_CHAIN_PARAMS.chainId
	// );

	// const verifyWindowAndChainID = Boolean(
	// 	window !== undefined &&
	// 		typeof window !== "undefined" &&
	// 		Number(window?.ethereum?.networkVersion) !== convertedChainIdToNumber
	// );

	const getWindowChainId =
		window !== undefined &&
		typeof window !== "undefined" &&
		Number(window?.ethereum?.networkVersion);

	const verifyCurrentNetwork = currentNetworkChainId ?? getWindowChainId;

	const getConnectorProvider = await connector.getProvider();

	if (
		!SUPPORTED_NETWORK_CHAINS.includes(verifyCurrentNetwork as number) &&
		getConnectorProvider
	) {
		await getConnectorProvider
			.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: NEVM_CHAIN_PARAMS.chainId }],
			})
			.then(() => setWalletError(false))
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.catch(async (error: any) => {
				if (error.code === 4902) {
					await getConnectorProvider
						.request({
							method: "wallet_addEthereumChain",
							params: [NEVM_CHAIN_PARAMS],
						})
						.then(() => setWalletError(false));
				}
			});
	}
};
