import { BigNumber, ethers } from "ethers";
import MINICHEF_ABI from "@pollum-io/pegasys-protocol/artifacts/contracts/earn/MiniChefV2.sol/MiniChefV2.json";
import STAKING_REWARDS_ABI from "@pollum-io/pegasys-protocol/artifacts/contracts/earn/StakingRewards.sol/StakingRewards.json";
import IPegasysPairABI from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-core/interfaces/IPegasysPair.sol/IPegasysPair.json";
import IPegasysRouterABI from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-periphery/interfaces/IPegasysRouter.sol/IPegasysRouter.json";
import PSYS_ABI from "@pollum-io/pegasys-protocol/artifacts/contracts/PegasysToken.sol/PegasysToken.json";

import { ChainId } from "@pollum-io/pegasys-sdk";
import {
	MINICHEF_ADDRESS,
	PSYS,
	STAKE_ADDRESS,
} from "pegasys-services/constants";
import { ROUTER_ADDRESS } from "helpers/consts";
import { getAddress } from "@ethersproject/address";
import Wallet from "./wallet";
import ERC20_ABI from "../abis/erc20.json";
import {
	IContractFrameworkGetContractProps,
	IContractFrameworkEstimateGasProps,
	TContract,
	IContractFrameworkCallProps,
} from "../dto";

class ContractFramework {
	static getContract(props: IContractFrameworkGetContractProps): TContract {
		const providerOrSigner = props.provider ?? Wallet.getSignerOrProvider();

		const contract = new ethers.Contract(
			getAddress(props.address),
			props.abi,
			providerOrSigner
		);

		return contract;
	}

	static async estimateGas(
		props: IContractFrameworkEstimateGasProps
	): Promise<BigNumber> {
		const estimate = props.contract.estimateGas[props.methodName];

		const gas = await estimate(
			...(props.args ?? []),
			props.value ? { value: props.value } : {}
		);

		return gas;
	}

	static async getGasLimit(
		props: IContractFrameworkEstimateGasProps
	): Promise<BigNumber> {
		const gas = await this.estimateGas(props);

		const gasLimit = gas.mul(BigNumber.from(4));

		return gasLimit;
	}

	static async call(props: IContractFrameworkCallProps) {
		const gasLimit = await this.getGasLimit(props);

		const res = await props.contract[props.methodName](...(props.args ?? []), {
			...(props.value ? { value: props.value } : {}),
			gasLimit,
		});

		return res;
	}

	static TokenContract(address: string) {
		const contract = this.getContract({
			abi: ERC20_ABI,
			address,
		});

		return contract;
	}

	static RouterContract(chainId?: ChainId) {
		const contract = this.getContract({
			abi: IPegasysRouterABI.abi,
			address: ROUTER_ADDRESS[chainId ?? ChainId.NEVM],
		});

		return contract;
	}

	static FarmContract(chainId: ChainId) {
		const contract = this.getContract({
			abi: MINICHEF_ABI.abi,
			address: MINICHEF_ADDRESS,
		});

		return contract;
	}

	static StakeContract(chainId?: ChainId) {
		const contract = this.getContract({
			abi: STAKING_REWARDS_ABI.abi,
			address: STAKE_ADDRESS,
		});

		return contract;
	}

	static PairContract(address: string) {
		const contract = this.getContract({
			address,
			abi: IPegasysPairABI.abi,
		});

		return contract;
	}

	static PSYSContract(chainId: ChainId) {
		const contract = this.getContract({
			address: PSYS[chainId ?? ChainId.NEVM].address,
			abi: PSYS_ABI.abi,
		});

		return contract;
	}
}

export default ContractFramework;
