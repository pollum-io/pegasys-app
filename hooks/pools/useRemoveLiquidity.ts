/* eslint-disable */
// @ts-nocheck
import { Web3Provider } from "@ethersproject/providers";
import IPegasysPairABI from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-core/interfaces/IPegasysPair.sol/IPegasysPair.json";
import IPegasysRouterABI from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-periphery/interfaces/IPegasysRouter.sol/IPegasysRouter.json";
import { JSBI, NSYS, Percent, TokenAmount } from "@pollum-io/pegasys-sdk";
import { BigNumber, Signer } from "ethers";
import { splitSignature } from "ethers/lib/utils";
import { ROUTER_ADDRESS } from "helpers/consts";
import { useTransactionDeadline } from "hooks/swap/useTransactionDeadline";
import { ITx, IWalletHookInfos, WrappedTokenInfo } from "types";
import {
	addTransaction,
	calculateGasMargin,
	calculateSlippageAmount,
	createContractUsingAbi,
	getBalanceOfSingleCall,
	getContract,
	getTotalSupply,
} from "utils";
import { useState } from "react";
import { useAllCommonPairs } from "hooks/swap/useAllCommonPairs";
import { Token } from "@pollum-io/pegasys-sdk";
import { ApprovalState, IApprovalState } from "contexts";
import { useTranslation } from "react-i18next";
import { IAmounts } from "components";

export const UseRemoveLiquidity = (
	pairAddress: string,
	sliderValue: number,
	walletInfos: IWalletHookInfos,
	signer: Signer,
	tradeTokens: WrappedTokenInfo[],
	allowedSlippage: number,
	setTransactions: React.Dispatch<React.SetStateAction<ITx>>,
	transactions: ITx,
	setCurrentTxHash: React.Dispatch<React.SetStateAction<string>>,
	setApprovalState: React.Dispatch<React.SetStateAction<IApprovalState>>,
	approvalState: IApprovalState,
	setTxSignature: React.Dispatch<React.SetStateAction<boolean>>,
	transactionDeadlineValue: BigNumber | number
) => {
	const [signatureData, setSignatureData] = useState<{
		v: number;
		r: string;
		s: string;
		deadline: number;
	} | null>(null);
	const { t } = useTranslation();
	const { walletAddress: account, chainId, provider } = walletInfos;
	const deadline = useTransactionDeadline(transactionDeadlineValue);
	const [currencyA, currencyB] = [tradeTokens[0], tradeTokens[1]];
	const chainRouter = ROUTER_ADDRESS[chainId];

	const pairContract =
		pairAddress &&
		createContractUsingAbi(pairAddress, IPegasysPairABI?.abi, signer);

	const currencyBIsETH = currencyB?.symbol === "SYS";
	const oneCurrencyIsETH = currencyA?.symbol === "SYS" || currencyBIsETH;

	let percentToRemove: Percent = new Percent(sliderValue.toString(), "100");

	async function onAttemptToApprove() {
		const pairs = await useAllCommonPairs(currencyA, currencyB, walletInfos);

		const pair = pairs[0];

		const pairBalance = await getBalanceOfSingleCall(
			pairAddress,
			account,
			signer,
			6
		);

		const value = JSBI.BigInt(Math.floor(Number(pairBalance)));

		const pairBalanceAmount = new TokenAmount(pair.liquidityToken, value);

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
			pair?.liquidityToken,
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
			verifyingContract: pair.liquidityToken.address,
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
					setTxSignature(true);
				})
				.catch(error => {
					// for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
					if (error?.code !== 4001) {
						console.log(error?.code);
					}
				});
	}

	async function onRemove() {
		const pairs = await useAllCommonPairs(currencyA, currencyB, walletInfos);

		const pair = pairs[0];

		const pairBalance = await getBalanceOfSingleCall(
			pairAddress,
			account,
			signer,
			6
		);

		const value = JSBI.BigInt(Math.floor(Number(pairBalance)));

		const pairBalanceAmount = new TokenAmount(pair.liquidityToken, value);

		const totalSupply = await getTotalSupply(pair.liquidityToken, signer);

		const liquidityValueA =
			pair &&
			totalSupply &&
			pairBalanceAmount &&
			currencyA &&
			currencyA instanceof Token &&
			JSBI.greaterThanOrEqual(totalSupply.raw, pairBalanceAmount.raw)
				? new TokenAmount(
						currencyA,
						pair.getLiquidityValue(
							currencyA,
							totalSupply,
							pairBalanceAmount,
							false
						).raw
				  )
				: undefined;

		const liquidityValueB =
			pair &&
			totalSupply &&
			pairBalanceAmount &&
			currencyB &&
			currencyB instanceof Token &&
			JSBI.greaterThanOrEqual(totalSupply.raw, pairBalanceAmount.raw)
				? new TokenAmount(
						currencyB,
						pair.getLiquidityValue(
							currencyB,
							totalSupply,
							pairBalanceAmount,
							false
						).raw
				  )
				: undefined;

		const currencyAmountA =
			liquidityValueA &&
			new TokenAmount(
				currencyA,
				percentToRemove?.multiply(liquidityValueA?.raw).quotient
			);
		const currencyAmountB =
			liquidityValueB &&
			new TokenAmount(
				currencyB,
				percentToRemove?.multiply(liquidityValueB?.raw).quotient
			);

		console.log({
			currencyAmountA: currencyAmountA && currencyAmountA.toSignificant(6),
			currencyAmountB: currencyAmountB && currencyAmountB.toSignificant(6),
		});

		if (!chainId || !provider || !account || !deadline)
			throw new Error("missing dependencies");

		const router = await getContract(
			chainRouter,
			signer as Signer,
			IPegasysRouterABI?.abi
		);

		const amountsMin = {
			CURRENCY_A: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
			CURRENCY_B: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
		};

		if (!currencyA || !currencyB) throw new Error("missing tokens");
		const liquidityAmount = new TokenAmount(
			pair?.liquidityToken,
			percentToRemove.multiply(pairBalanceAmount?.raw).quotient
		);
		if (!liquidityAmount) throw new Error("missing liquidity amount");

		if (!currencyA || !currencyB) throw new Error("could not wrap");

		let methodNames: string[],
			args: Array<string | string[] | number | boolean>;
		// we have approval, use normal remove liquidity
		if (approvalState.status === ApprovalState.APPROVED) {
			// removeLiquiditySYS
			if (oneCurrencyIsETH) {
				methodNames = [
					"removeLiquiditySYS",
					"removeLiquiditySYSSupportingFeeOnTransferTokens",
				];
				args = [
					currencyBIsETH ? currencyA?.address : currencyB?.address,
					liquidityAmount.raw.toString(),
					amountsMin[currencyBIsETH ? "CURRENCY_A" : "CURRENCY_B"].toString(),
					amountsMin[currencyBIsETH ? "CURRENCY_B" : "CURRENCY_A"].toString(),
					account,
					deadline.toHexString(),
				];
			}
			// removeLiquidity
			else {
				methodNames = ["removeLiquidity"];
				args = [
					currencyA?.address,
					currencyB?.address,
					liquidityAmount.raw.toString(),
					amountsMin["CURRENCY_A"].toString(),
					amountsMin["CURRENCY_B"].toString(),
					account,
					deadline.toHexString(),
				];
			}
		}
		// we have a signataure, use permit versions of remove liquidity
		else if (signatureData !== null) {
			// removeLiquiditySYSWithPermit
			if (oneCurrencyIsETH) {
				methodNames = [
					"removeLiquiditySYSWithPermit",
					"removeLiquiditySYSWithPermitSupportingFeeOnTransferTokens",
				];
				args = [
					currencyBIsETH ? currencyA?.address : currencyB?.address,
					liquidityAmount.raw.toString(),
					amountsMin[currencyBIsETH ? "CURRENCY_A" : "CURRENCY_B"].toString(),
					amountsMin[currencyBIsETH ? "CURRENCY_B" : "CURRENCY_A"].toString(),
					account,
					signatureData.deadline,
					false,
					signatureData.v,
					signatureData.r,
					signatureData.s,
				];
			}
			// removeLiquiditySYSWithPermit
			else {
				methodNames = ["removeLiquidityWithPermit"];
				args = [
					currencyA?.address,
					currencyB?.address,
					liquidityAmount.raw.toString(),
					amountsMin["CURRENCY_A"].toString(),
					amountsMin["CURRENCY_B"].toString(),
					account,
					signatureData.deadline,
					false,
					signatureData.v,
					signatureData.r,
					signatureData.s,
				];
			}
		} else {
			throw new Error(
				"Attempting to confirm without approval or a signature. Please contact support."
			);
		}

		const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
			methodNames.map(methodName =>
				router?.estimateGas[methodName](...args)
					.then(calculateGasMargin)
					.catch(error => {
						console.log(`estimateGas failed`, methodName, args, error);
						return undefined;
					})
			)
		);

		const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(
			safeGasEstimate => BigNumber.isBigNumber(safeGasEstimate)
		);

		// all estimations failed...
		if (indexOfSuccessfulEstimation === -1) {
			console.log("This transaction would fail. Please contact support.");
		} else {
			const methodName = methodNames[indexOfSuccessfulEstimation];
			const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation];

			setTxSignature(true);
			await router[methodName](...args, {
				gasLimit: safeGasEstimate,
			})
				.then((response: TransactionResponse) => {
					addTransaction(response, walletInfos, setTransactions, transactions, {
						summary:
							t("removeLiquidity.remove") +
							" " +
							currencyAmountA?.toSignificant(3) +
							" " +
							currencyA?.symbol +
							" and " +
							currencyAmountB?.toSignificant(3) +
							" " +
							currencyB?.symbol,
					});
					setApprovalState({
						status: ApprovalState.PENDING,
						type: "remove-liquidity",
					});
					setCurrentTxHash(response?.hash);
				})
				.catch((error: Error) => {
					// we only care if the error is something _other_ than the user rejected the tx
					console.log(error);
				});
		}
	}

	async function onSlide(
		setAvailableTokensAmount: React.Dispatch<React.SetStateAction<IAmounts>>
	) {
		const pairs = await useAllCommonPairs(currencyA, currencyB, walletInfos);

		const pair = pairs[0];

		const pairBalance = await getBalanceOfSingleCall(
			pairAddress,
			account,
			signer,
			6
		);

		const value = JSBI.BigInt(Math.floor(Number(pairBalance)));

		const pairBalanceAmount = new TokenAmount(pair.liquidityToken, value);

		const totalSupply = await getTotalSupply(pair.liquidityToken, signer);

		const liquidityValueA =
			pair &&
			totalSupply &&
			pairBalanceAmount &&
			currencyA &&
			currencyA instanceof Token &&
			JSBI.greaterThanOrEqual(totalSupply.raw, pairBalanceAmount.raw)
				? new TokenAmount(
						currencyA,
						pair.getLiquidityValue(
							currencyA,
							totalSupply,
							pairBalanceAmount,
							false
						).raw
				  )
				: undefined;

		const liquidityValueB =
			pair &&
			totalSupply &&
			pairBalanceAmount &&
			currencyB &&
			currencyB instanceof Token &&
			JSBI.greaterThanOrEqual(totalSupply.raw, pairBalanceAmount.raw)
				? new TokenAmount(
						currencyB,
						pair.getLiquidityValue(
							currencyB,
							totalSupply,
							pairBalanceAmount,
							false
						).raw
				  )
				: undefined;

		const currencyAmountA =
			liquidityValueA &&
			new TokenAmount(
				currencyA,
				percentToRemove?.multiply(liquidityValueA?.raw).quotient
			);
		const currencyAmountB =
			liquidityValueB &&
			new TokenAmount(
				currencyB,
				percentToRemove?.multiply(liquidityValueB?.raw).quotient
			);

		setAvailableTokensAmount({
			token0: currencyAmountA?.toSignificant(6),
			token1: currencyAmountB?.toSignificant(6),
		});

		return;
	}

	return {
		onAttemptToApprove,
		onRemove,
		onSlide,
	};
};
