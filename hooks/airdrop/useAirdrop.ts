import React from "react";
import { ChainId, JSBI, TokenAmount } from "@pollum-io/pegasys-sdk";
import AirdropInfo from "helpers/airdrop.json";
import {
	PegasysContracts,
	PegasysTokens,
	ApprovalState,
	IApprovalState,
} from "pegasys-services";
import AIRDROP_ABI from "utils/abis/airdropAbi.json";
import {
	addTransaction,
	calculateGasMargin,
	createContractUsingAbi,
	singleCallWithoutParams,
} from "utils";
import { Signer, ethers } from "ethers";
import { ITransactionResponse, ITx, IWalletHookInfos } from "types";

export const userHasAvailableClaim = async (
	address: string,
	chainId: ChainId,
	signer:
		| ethers.providers.Provider
		| ethers.providers.Web3Provider
		| ethers.providers.JsonRpcProvider
		| Signer
		| null
) => {
	// eslint-disable-next-line
	// @ts-ignore
	const userClaimData = AirdropInfo.claims[address || ""];
	const airDropContract = createContractUsingAbi(
		PegasysContracts[chainId].AIRDROP_ADDRESS,
		AIRDROP_ABI,
		signer
	);
	const fetchIsClaimed = await singleCallWithoutParams(
		airDropContract,
		"isClaimed"
	);

	const isClaimedResult =
		userClaimData && (await fetchIsClaimed(Number(userClaimData?.index)));

	return Boolean(userClaimData && isClaimedResult === false);
};

export const userUnclaimedAmount = async (
	address: string,
	chainId: ChainId,
	signer:
		| ethers.providers.Provider
		| ethers.providers.Web3Provider
		| ethers.providers.JsonRpcProvider
		| Signer
		| null
) => {
	// eslint-disable-next-line
	// @ts-ignore
	const userClaimData = AirdropInfo.claims[address || ""];
	const psys = chainId ? PegasysTokens[chainId].PSYS : undefined;
	const canClaim = await userHasAvailableClaim(
		address,
		chainId,
		signer ?? null
	);

	if (!psys) return undefined;
	if (!userClaimData) return new TokenAmount(psys, JSBI.BigInt(0));
	if (!canClaim && psys) {
		return new TokenAmount(psys, JSBI.BigInt(0));
	}
	return new TokenAmount(psys, JSBI.BigInt(userClaimData.amount));
};

export const useClaimCallback = (
	address: string,
	chainId: ChainId,
	signer:
		| ethers.providers.Provider
		| ethers.providers.Web3Provider
		| ethers.providers.JsonRpcProvider
		| Signer
		| undefined,
	walletInfos: IWalletHookInfos,
	setApprovalState: React.Dispatch<React.SetStateAction<IApprovalState>>,
	setCurrentTxHash: React.Dispatch<React.SetStateAction<string>>,
	setTransactions: React.Dispatch<React.SetStateAction<ITx>>,
	transactions: ITx
) => {
	// eslint-disable-next-line
	// @ts-ignore
	const userClaimData = AirdropInfo.claims[address || ""];
	const airDropContract = createContractUsingAbi(
		PegasysContracts[chainId].AIRDROP_ADDRESS,
		AIRDROP_ABI,
		signer ?? null
	);

	const claimCallback = async () => {
		if (!address || !airDropContract || !chainId || !signer || !userClaimData)
			return undefined;
		const args = [
			userClaimData.index,
			address,
			userClaimData.amount,
			userClaimData.proof,
		];

		return airDropContract.estimateGas
			.claim(...args, {})
			.then(estimatedGasLimit =>
				airDropContract
					.claim(...args, {
						value: null,
						gasLimit: calculateGasMargin(estimatedGasLimit),
					})
					.then((response: ITransactionResponse) => {
						addTransaction(
							response,
							walletInfos,
							setTransactions,
							transactions,
							{
								summary: `Claimed PSYS`,
								claim: { recipient: address },
							}
						);
						setApprovalState({ status: ApprovalState.PENDING, type: "claim" });
						setCurrentTxHash(response?.hash);
					})
					.catch((err: any) => {
						console.log(err);
						return null;
					})
			);
	};

	return { claimCallback };
};
