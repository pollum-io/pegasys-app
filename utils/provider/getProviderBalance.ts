import { ethers, Signer } from "ethers";
import { UseENS } from "hooks";
import { removeScientificNotation, truncateNumberDecimalsPlaces } from "utils";

interface IGetProviderBalance {
	validatedAddress: string | null;
	providerBalanceFormattedValue: string;
	providerTruncatedBalance: string;
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
	if (!walletAddress) {
		return {
			validatedAddress: "",
			providerBalanceFormattedValue: "0",
			providerTruncatedBalance: "0",
		};
	}

	const validateAddress = UseENS(walletAddress);

	const providerTokenBalance = await provider
		?.getBalance(validateAddress.address as string)
		.then(result => result.toString());

	const providerBalanceFormattedValue =
		providerTokenBalance &&
		ethers.utils.formatEther(providerTokenBalance as string);

	const providerTruncatedBalance =
		providerBalanceFormattedValue &&
		String(
			+providerBalanceFormattedValue > 0 && +providerBalanceFormattedValue < 1
				? removeScientificNotation(parseFloat(providerBalanceFormattedValue))
				: truncateNumberDecimalsPlaces(
						parseFloat(providerBalanceFormattedValue)
				  )
		);

	return {
		validatedAddress: validateAddress.address,
		providerBalanceFormattedValue: `${providerBalanceFormattedValue}`,
		providerTruncatedBalance: `${providerTruncatedBalance}`,
	};
};
