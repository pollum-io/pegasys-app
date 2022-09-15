import { BigNumber, ethers } from "ethers";
import { abi as MINICHEF_ABI } from "@pollum-io/pegasys-protocol/artifacts/contracts/earn/MiniChefV2.sol/MiniChefV2.json";
import { abi as STAKING_REWARDS_ABI } from "@pollum-io/pegasys-protocol/artifacts/contracts/earn/StakingRewards.sol/StakingRewards.json";
import { abi as IPegasysPairABI } from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-core/interfaces/IPegasysPair.sol/IPegasysPair.json";

import Wallet from "./wallet";
import ERC20_ABI from "../abis/erc20.json";
import {
	IContractFrameworkGetContractProps,
	IContractFrameworkEstimateGasProps,
	TContract,
	IContractFrameworkCallProps,
} from "../dto";
import { MINICHEF_ADDRESS } from "../constants";

class ContractFramework {
	static getContract(props: IContractFrameworkGetContractProps): TContract {
		const providerOrSigner = props.provider ?? Wallet.getSignerOrProvider();

		const contract = new ethers.Contract(
			props.address,
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

	static StakingContract(address: string) {
		const contract = this.getContract({
			abi: address === MINICHEF_ADDRESS ? MINICHEF_ABI : STAKING_REWARDS_ABI,
			address,
		});

		return contract;
	}

	static PairContract(address: string) {
		const contract = this.getContract({
			address,
			abi: IPegasysPairABI,
		});

		return contract;
	}
}

export default ContractFramework;
