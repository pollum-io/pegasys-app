import { ethers, Signer } from "ethers";
import { UseENS } from "hooks";
import { removeScientificNotation, verifyZerosInBalanceAndFormat } from "utils";

interface IGetProviderBalance {
	validatedAddress: string | null;
	providerFullBalance: string;
	providerFormattedBalance: string;
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

	const providerFullBalance = ethers.utils.formatEther(
		providerTokenBalance as string
	);

	const finalValueFormatted = verifyZerosInBalanceAndFormat(
		Number(providerFullBalance)
	);

	return {
		validatedAddress: validateAddress.address,
		providerFullBalance,
		providerFormattedBalance: finalValueFormatted,
	};
};
