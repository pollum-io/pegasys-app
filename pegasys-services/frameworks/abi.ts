import MINICHEF_ABI from "@pollum-io/pegasys-protocol/artifacts/contracts/earn/MiniChefV2.sol/MiniChefV2.json";
import STAKING_REWARDS_ABI from "@pollum-io/pegasys-protocol/artifacts/contracts/earn/StakingRewards.sol/StakingRewards.json";
import PAIR_ABI from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-core/interfaces/IPegasysPair.sol/IPegasysPair.json";
import ROUTER_ABI from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-periphery/interfaces/IPegasysRouter.sol/IPegasysRouter.json";
import PSYS_ABI from "@pollum-io/pegasys-protocol/artifacts/contracts/PegasysToken.sol/PegasysToken.json";
import REWARDERVIAMULTIPLIER_ABI from "@pollum-io/pegasys-protocol/artifacts/contracts/earn/RewarderViaMultiplier.sol/RewarderViaMultiplier.json";

import GOVERNANCE_ABI from "../abis/governance.json";
import ERC20_ABI from "../abis/erc20.json";

class AbiFramework {
	static getMinichefAbi() {
		return MINICHEF_ABI.abi;
	}

	static getRouterAbi() {
		return ROUTER_ABI.abi;
	}

	static getStakeABi() {
		return STAKING_REWARDS_ABI.abi;
	}

	static getPsysABi() {
		return PSYS_ABI.abi;
	}

	static getPairABi() {
		return PAIR_ABI.abi;
	}

	static getTokenABi() {
		return ERC20_ABI;
	}

	static getExtraRewardABi() {
		return REWARDERVIAMULTIPLIER_ABI.abi;
	}

	static getGovernanceAbi() {
		return GOVERNANCE_ABI;
	}
}

export default AbiFramework;
