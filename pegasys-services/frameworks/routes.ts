import { ChainId } from "@pollum-io/pegasys-sdk";

import { PegasysContracts, PegasysTokens } from "../constants";

class RoutesFramework {
	static getMinichefAddress(chainId?: ChainId | null) {
		return PegasysContracts[chainId ?? ChainId.NEVM]?.MINICHEF_ADDRESS ?? "";
	}

	static getGovernanceAddress(chainId?: ChainId | null) {
		return PegasysContracts[chainId ?? ChainId.NEVM]?.GOVERNANCE_ADDRESS ?? "";
	}

	static getRouterAddress(chainId?: ChainId | null) {
		return PegasysContracts[chainId ?? ChainId.NEVM]?.ROUTER_ADDRESS;
	}

	static getStakeAddress(chainId?: ChainId | null) {
		return PegasysContracts[chainId ?? ChainId.NEVM]?.STAKE_ADDRESS;
	}

	static getPsysAddress(chainId?: ChainId | null) {
		const psys = PegasysTokens[chainId ?? ChainId.NEVM]?.PSYS;

		return psys ? psys.address : "";
	}
}

export default RoutesFramework;
