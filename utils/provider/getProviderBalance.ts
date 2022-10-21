import { ethers, Signer } from "ethers";
import { UseENS } from "hooks";

interface IGetProviderBalance {
	validatedAddress: string | null;
	providerBalanceFormattedValue: string;
}

export const getProviderBalance = async (
	provider:
		| ethers.providers.Provider
		| ethers.providers.Web3Provider
		| ethers.providers.JsonRpcProvider
		| Signer
		| undefined,
	walletAddress: string
): Promise<IGetProviderBalance> => {
	const validateAddress = UseENS(walletAddress);

	const providerTokenBalance = await provider
		?.getBalance(validateAddress.address as string)
		.then(result => result.toString());

	const providerBalanceFormattedValue = ethers.utils.formatEther(
		providerTokenBalance as string
	);

	return {
		validatedAddress: validateAddress.address,
		providerBalanceFormattedValue,
	};
};
