import { ChainId } from "@pollum-io/pegasys-sdk";

import { NETWORKS_CHAIN_PARAMS } from "../constants";

class TransactionFramework {
	static async getPendingTxs(address: string, chainId?: ChainId | null) {
		const rpcUrl = NETWORKS_CHAIN_PARAMS[chainId ?? ChainId.NEVM].apiUrls[0];

		const result = await fetch(
			`${rpcUrl}?module=account&action=pendingtxlist&address=${address}`
		);

		const txs = await result.json();

		return txs;
	}
}

export default TransactionFramework;
