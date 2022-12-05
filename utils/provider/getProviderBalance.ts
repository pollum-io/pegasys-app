import { ethers, Signer } from "ethers";
import { UseENS } from "hooks";
import { verifyZerosInBalanceAndFormat } from "utils";

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
		| null,
	walletAddress: string
): Promise<IGetProviderBalance> => {
	if (!walletAddress) {
		return {
			validatedAddress: "",
			providerFullBalance: "0",
			providerFormattedBalance: "0",
		};
	}

	const validateAddress = UseENS(walletAddress);

	const providerTokenBalance = await provider
		?.getBalance(validateAddress.address as string)
		.then(result => result.toString());

	const providerFullBalance =
		(providerTokenBalance &&
			ethers.utils.formatEther(providerTokenBalance as string)) ||
		"0";

	const finalValueFormatted = verifyZerosInBalanceAndFormat(
		Number(providerFullBalance)
	);

	return {
		validatedAddress: validateAddress.address,
		providerFullBalance,
		providerFormattedBalance: finalValueFormatted,
	};
};
