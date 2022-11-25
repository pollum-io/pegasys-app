import { BigNumber, ethers } from "ethers";
import Wallet from "./wallet";
import RoutesFramework from "./routes";
import {
	IContractFrameworkGetContractProps,
	IContractFrameworkEstimateGasProps,
	TContract,
	IContractFrameworkCallProps,
	IGetDefinedContract,
	IGetSpecificContract,
} from "../dto";
import AbiFramework from "./abi";

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

	static TokenContract(props: IGetDefinedContract) {
		return this.getContract({
			abi: AbiFramework.getTokenABi(),
			...props,
		});
	}

	static RouterContract({ chainId, provider }: IGetSpecificContract) {
		return this.getContract({
			abi: AbiFramework.getRouterAbi(),
			address: RoutesFramework.getRouterAddress(chainId),
			provider,
		});
	}

	static FarmContract({ chainId, provider }: IGetSpecificContract) {
		return this.getContract({
			abi: AbiFramework.getMinichefAbi(),
			address: RoutesFramework.getMinichefAddress(chainId),
			provider,
		});
	}

	static StakeContract({ chainId, provider }: IGetSpecificContract) {
		return this.getContract({
			abi: AbiFramework.getStakeABi(),
			address: RoutesFramework.getStakeAddress(chainId),
			provider,
		});
	}

	static PairContract(props: IGetDefinedContract) {
		return this.getContract({
			abi: AbiFramework.getPairABi(),
			...props,
		});
	}

	static ExtraRewardContract(props: IGetDefinedContract) {
		return this.getContract({
			abi: AbiFramework.getExtraRewardABi(),
			...props,
		});
	}

	static PSYSContract({ chainId, provider }: IGetSpecificContract) {
		const contract = this.getContract({
			address: RoutesFramework.getPsysAddress(chainId),
			abi: AbiFramework.getPsysABi(),
			provider,
		});

		return contract;
	}

	static GovernanceContract({ chainId, provider }: IGetSpecificContract) {
		const contract = this.getContract({
			address: RoutesFramework.getGovernanceAddress(chainId),
			abi: AbiFramework.getGovernanceAbi(),
			provider,
		});

		return contract;
	}
}

export default ContractFramework;
