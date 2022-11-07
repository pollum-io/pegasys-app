import {
	NETWORKS_CHAIN_PARAMS,
	SUPPORTED_NETWORK_CHAINS,
} from "pegasys-services";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { ChainId } from "@pollum-io/pegasys-sdk";

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

	const getConnectorProvider = await window?.ethereum;

	if (
		!SUPPORTED_NETWORK_CHAINS.includes(verifyCurrentNetwork as number) &&
		getConnectorProvider
	) {
		await getConnectorProvider
			.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: NETWORKS_CHAIN_PARAMS[ChainId.NEVM].chainId }],
			})
			.then(() => setWalletError(false))
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.catch(async (error: any) => {
				if (error.code === 4902) {
					await getConnectorProvider
						.request({
							method: "wallet_addEthereumChain",
							params: [NETWORKS_CHAIN_PARAMS[ChainId.NEVM]],
						})
						.then(() => setWalletError(false));
				}
			});
	}
};
