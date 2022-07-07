import { createContractUsingAbi } from "utils";
import { ethers, Signer } from "ethers";
import abi20 from "utils/abis/erc20.json";

interface ITokenInfo {
	decimals: number;
	symbol: string;
	name: string;
}

export const useCurrency = () => {
	const getToken = async (
		tokenAddress: string,
		signerOrProvider:
			| Signer
			| ethers.providers.JsonRpcProvider
			| ethers.providers.Web3Provider
			| undefined
	): Promise<ITokenInfo> => {
		// eslint-disable-next-line
		console.log("PROVIDER: ", signerOrProvider);
		const contract = createContractUsingAbi(
			tokenAddress,
			abi20,
			signerOrProvider
		);

		const [decimals, name, symbol] = await Promise.all([
			contract.decimals(),
			contract.name(),
			contract.symbol(),
		]);

		return {
			decimals,
			name,
			symbol,
		};
	};

	return {
		getToken,
	};
};
