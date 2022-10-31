import { ChainId } from "@pollum-io/pegasys-sdk";
import { ROUTER_ADDRESS } from "helpers/consts";

import { MINICHEF_ADDRESS, PSYS, STAKE_ADDRESS } from "../constants";

class RoutesFramework {
	static getMinichefAddress(chainId?: ChainId | null) {
		return MINICHEF_ADDRESS[ChainId.NEVM];
	}

	static getRouterAddress(chainId?: ChainId | null) {
		return ROUTER_ADDRESS[chainId ?? ChainId.NEVM];
	}

	static getStakeAddress(chainId?: ChainId | null) {
		return STAKE_ADDRESS[ChainId.NEVM];
	}

	static getPsysAddress(chainId?: ChainId | null) {
		const router: { [k: number]: string } = {};

		Object.keys(PSYS).forEach((chain: unknown) => {
			router[Number(chain)] = PSYS[chain as keyof typeof PSYS].address;
		});

		return router[chainId ?? ChainId.NEVM];
	}
}

export default RoutesFramework;
