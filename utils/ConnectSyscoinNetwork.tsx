import { SYS_TESTNET_CHAIN_PARAMS } from "helpers/consts";
import { AbstractConnector } from "@web3-react/abstract-connector";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

export const ConnectSyscoinNetwork = async (
	connector: AbstractConnector,
	setWalletError: React.Dispatch<React.SetStateAction<boolean | undefined>>
) => {
	const convertedChainIdToNumber = parseInt(
		SYS_TESTNET_CHAIN_PARAMS.chainId,
		16
	);

	const verifyWindowAndChainID = Boolean(
		window !== undefined &&
			typeof window !== "undefined" &&
			Number(window?.ethereum?.networkVersion) !== convertedChainIdToNumber
	);

	const getConnectorProvider = await connector.getProvider();

	const setErrorAndRefresh = () => {
		setWalletError(false);

		setTimeout(() => {
			window.location.reload();
		}, 500);
	};

	if (verifyWindowAndChainID && getConnectorProvider) {
		await getConnectorProvider
			.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: SYS_TESTNET_CHAIN_PARAMS.chainId }],
			})
			.catch(async (error: any) => {
				if (error.code === 4902) {
					await getConnectorProvider.request({
						method: "wallet_addEthereumChain",
						params: [SYS_TESTNET_CHAIN_PARAMS],
					});
					setErrorAndRefresh();
				}
			});
		setErrorAndRefresh();
	}
};
