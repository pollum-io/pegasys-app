import { BigNumber, ethers } from "ethers";

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
}

export default ContractFramework;
