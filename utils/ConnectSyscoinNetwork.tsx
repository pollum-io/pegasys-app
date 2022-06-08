import { injected } from "utils/connectors";
import { NEVM_CHAIN_PARAMS } from "helpers/consts";

export const ConnectSyscoinNetwork = () => {
	injected.getProvider().then(provider => {
		provider
			.request({
				method: "wallet_addEthereumChain",
				params: [NEVM_CHAIN_PARAMS],
			})
			.catch((error: never) => {
				// eslint-disable-next-line no-console
				console.log(error);
			});
	});
};
