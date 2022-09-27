import React from "react";
import { ChainId, JSBI, TokenAmount } from "@pollum-io/pegasys-sdk";
import AirdropInfo from "helpers/airdrop.json";
import { AIRDROP_ADDRESS, PSYS } from "helpers/consts";
import AIRDROP_ABI from "utils/abis/airdropAbi.json";
import {
	addTransaction,
	calculateGasMargin,
	createContractUsingAbi,
	singleCall,
} from "utils";
import { Signer } from "ethers";
import { ITransactionResponse, ITx, IWalletHookInfos } from "types";
import { ApprovalState, IApprovalState } from "contexts";

export const userHasAvailableClaim = async (
	address: string,
	chainId: ChainId,
	signer: Signer
) => {
	// eslint-disable-next-line
	// @ts-ignore
	const userClaimData = AirdropInfo.claims[address || ""];
	const airDropContract = createContractUsingAbi(
		AIRDROP_ADDRESS[chainId] as string,
		AIRDROP_ABI,
		signer
	);
	const fetchIsClaimed = await singleCall(airDropContract, "isClaimed");

	const isClaimedResult = await fetchIsClaimed(Number(userClaimData?.index));

	return Boolean(userClaimData && isClaimedResult === false);
};

export const userUnclaimedAmount = async (
	address: string,
	chainId: ChainId,
	signer: Signer
) => {
	const psys = chainId ? PSYS[chainId] : undefined;
	if (!psys) return undefined;
	const canClaim = await userHasAvailableClaim(address, chainId, signer);
	// eslint-disable-next-line
	// @ts-ignore
	const userClaimData = AirdropInfo.claims[address || ""];
	if (!canClaim && psys) {
		return new TokenAmount(psys, JSBI.BigInt(0));
	}
	return new TokenAmount(psys, JSBI.BigInt(userClaimData.amount));
};

export const useClaimCallback = (
	address: string,
	chainId: ChainId,
	signer: Signer,
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
		AIRDROP_ADDRESS[chainId] as string,
		AIRDROP_ABI,
		signer
	);

	const claimCallback = async () => {
		if (!address || !airDropContract || !chainId || !signer) return undefined;
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
