/* eslint-disable */
// @ts-nocheck
import { Web3Provider } from "@ethersproject/providers";
import IPegasysPairABI from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-core/interfaces/IPegasysPair.sol/IPegasysPair.json";
import { JSBI, Percent, TokenAmount } from "@pollum-io/pegasys-sdk";
import { Signer } from "ethers";
import { splitSignature } from "ethers/lib/utils";
import { ROUTER_ADDRESS } from "helpers/consts";
import { useTransactionDeadline } from "hooks/swap/useTransactionDeadline";
import { IWalletHookInfos, WrappedTokenInfo } from "types";
import { createContractUsingAbi, getBalanceOfSingleCall } from "utils";
import { useState, useEffect } from "react";
import { useAllCommonPairs } from "hooks/swap/useAllCommonPairs";

export const UseRemoveLiquidity = (
	pairAddress: string,
	sliderValue: number,
	walletInfos: IWalletHookInfos,
	signer: Signer,
	tradeTokens: WrappedTokenInfo[]
) => {
	const [signatureData, setSignatureData] = useState<{
		v: number;
		r: string;
		s: string;
		deadline: number;
	} | null>(null);
	const { walletAddress: account, chainId, provider } = walletInfos;
	const deadline = useTransactionDeadline();
	const [currencyA, currencyB] = [tradeTokens[0], tradeTokens[1]];

	const pairContract = createContractUsingAbi(
		pairAddress,
		IPegasysPairABI?.abi,
		signer
	);

	let percentToRemove: Percent = new Percent(sliderValue.toString(), "100");


	useEffect(() => {
		console.log("signatureData", signatureData);
	}, [signatureData]);

	async function onAttemptToApprove() {
		const pairBalance = await getBalanceOfSingleCall(
			pairAddress,
			account,
			signer,
			6
		);

		const pair = await useAllCommonPairs(currencyA, currencyB, walletInfos);

		const pairBalanceAmount = new TokenAmount(
			pair[0].liquidityToken,
			JSBI.BigInt(pairBalance.toString())
		);

		if (
			!pairContract ||
			!pair ||
			!provider ||
			!deadline ||
			!chainId ||
			!account
		)
			throw new Error("missing dependencies");
		const liquidityAmount = new TokenAmount(
			pair[0]?.liquidityToken,
			percentToRemove.multiply(pairBalanceAmount.raw).quotient
		);
		if (!liquidityAmount) throw new Error("missing liquidity amount");

		// try to gather a signature for permission
		const nonce = await pairContract.nonces(account);

		const EIP712Domain = [
			{ name: "name", type: "string" },
			{ name: "version", type: "string" },
			{ name: "chainId", type: "uint256" },
			{ name: "verifyingContract", type: "address" },
		];
		const domain = {
			name: "Pegasys LP Token",
			version: "1",
			chainId,
			verifyingContract: pair[0].liquidityToken.address,
		};
		const Permit = [
			{ name: "owner", type: "address" },
			{ name: "spender", type: "address" },
			{ name: "value", type: "uint256" },
			{ name: "nonce", type: "uint256" },
			{ name: "deadline", type: "uint256" },
		];
		const message = {
			owner: account,
			spender: ROUTER_ADDRESS[chainId],
			value: liquidityAmount.raw.toString(),
			nonce: nonce.toHexString(),
			deadline: deadline.toNumber(),
		};
		const data = JSON.stringify({
			types: {
				EIP712Domain,
				Permit,
			},
			domain,
			primaryType: "Permit",
			message,
		});

		provider instanceof Web3Provider &&
			provider
				.send("eth_signTypedData_v4", [account, data])
				.then(splitSignature)
				.then(signature => {
					setSignatureData({
						v: signature.v,
						r: signature.r,
						s: signature.s,
						deadline: deadline.toNumber(),
					});
				})
				.catch(error => {
					// for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
					if (error?.code !== 4001) {
						console.log(error?.code)
					}
				});
	}

	return {
		onAttemptToApprove,
	};
};
