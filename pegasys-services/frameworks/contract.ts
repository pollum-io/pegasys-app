import { BigNumber, ethers } from "ethers";
import { abi as MINICHEF_ABI } from "@pollum-io/pegasys-protocol/artifacts/contracts/earn/MiniChefV2.sol/MiniChefV2.json";
import { abi as STAKING_REWARDS_ABI } from "@pollum-io/pegasys-protocol/artifacts/contracts/earn/StakingRewards.sol/StakingRewards.json";
import { abi as IPegasysPairABI } from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-core/interfaces/IPegasysPair.sol/IPegasysPair.json";
import { abi as IPegasysRouterABI } from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-periphery/interfaces/IPegasysRouter.sol/IPegasysRouter.json";

import { ChainId } from "@pollum-io/pegasys-sdk";
import { MINICHEF_ADDRESS, STAKE_ADDRESS } from "pegasys-services/constants";
import { ROUTER_ADDRESS } from "helpers/consts";
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

	static RouterContract(chainId: ChainId) {
		const contract = this.getContract({
			abi: IPegasysRouterABI,
			address: ROUTER_ADDRESS[chainId],
		});

		return contract;
	}

	static FarmContract(chainId: ChainId) {
		const contract = this.getContract({
			abi: MINICHEF_ABI,
			address: MINICHEF_ADDRESS,
		});

		return contract;
	}

	static StakeContract(chainId: ChainId) {
		const contract = this.getContract({
			abi: STAKING_REWARDS_ABI,
			address: "0xE038E38B48F4123e1408865450E37edC78b736ED",
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
