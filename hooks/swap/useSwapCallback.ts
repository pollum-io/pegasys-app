/* eslint-disable */
import { Trade } from "@pollum-io/pegasys-sdk";
import { BigNumber, Signer } from "ethers";
import { UseENS } from "hooks";
import { calculateGasMargin, isZero, shortAddress } from "utils";
import { IWalletHookInfos } from "types";
import { UseBestSwapMethod } from "./useBestSwapMethod";
import { UseToastOptions } from "@chakra-ui/react";
import { TransactionResponse } from "@ethersproject/providers";
import { IFinishedTx, IPendingTx, useTransaction } from "pegasys-services";

export enum SwapCallbackState {
	INVALID,
	LOADING,
	VALID,
}

export function UseSwapCallback(
	trade: Trade | undefined, // trade to execute, required
	allowedSlippage: number, // in bips
	transactionDeadlineValue: BigNumber | number,
	walletInfos: IWalletHookInfos,
	signer: Signer,
	recipientAddress: string,
	setCurrentInputTokenName: React.Dispatch<React.SetStateAction<string>>,
	txType: string,
	toast: React.Dispatch<React.SetStateAction<UseToastOptions>>,
	onCloseTransaction: () => void,
	addTransactions: (tx: IPendingTx | IFinishedTx, pending?: boolean) => void
) {
	const { walletAddress, chainId: chain } = walletInfos;

	const recipient = !recipientAddress ? walletAddress : recipientAddress;

	const swapCalls = UseBestSwapMethod(
		trade as Trade,
		recipient,
		signer,
		walletInfos,
		allowedSlippage,
		transactionDeadlineValue
	);

	if (!trade || !walletAddress || !chain) {
		return {
			state: SwapCallbackState.INVALID,
			callback: null,
			error: "Missing dependencies",
		};
	}
	if (!recipient) {
		if (recipient !== null) {
			return {
				state: SwapCallbackState.INVALID,
				callback: null,
				error: "Invalid recipient",
			};
		}
		return { state: SwapCallbackState.LOADING, callback: null, error: null };
	}

	const tradeVersion: string = "v2";

	return {
		state: SwapCallbackState.VALID,
		callback: async function onSwap(): Promise<string> {
			const estimatedCalls = await Promise.all(
				swapCalls.map(call => {
					const {
						parameters: { methodName, args, value },
						contract,
					} = call;
					const options = !value || isZero(value) ? {} : { value };

					return contract.estimateGas[methodName](...args, options)
						.then(gasEstimate => ({
							call,
							gasEstimate,
						}))
						.catch(gasError => {
							console.debug(
								"Gas estimate failed, trying eth_call to extract error",
								call
							);

							return contract.callStatic[methodName](...args, options)
								.then(result => {
									console.debug(
										"Unexpected successful call after failed estimate gas",
										call,
										gasError,
										result
									);
									return {
										call,
										error: new Error(
											"Unexpected issue with estimating the gas. Please try again."
										),
									};
								})
								.catch(callError => {
									console.debug("Call threw error", call, callError);
									let errorMessage: string;
									switch (callError.reason) {
										case "PegasysRouter: INSUFFICIENT_OUTPUT_AMOUNT":
										case "PegasysRouter: EXCESSIVE_INPUT_AMOUNT":
											errorMessage =
												"This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.";
											break;
										default:
											errorMessage = `The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens you are swapping.`;
									}
									return { call, error: new Error(errorMessage) };
								});
						});
				})
			);

			// a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
			const successfulEstimation = estimatedCalls.find(
				(el, ix, list) =>
					"gasEstimate" in el &&
					(ix === list.length - 1 || "gasEstimate" in list[ix + 1])
			);

			if (!successfulEstimation) {
				const errorCalls = estimatedCalls.filter(call => "error" in call);
				if (errorCalls.length > 0)
					// @ts-ignore
					throw errorCalls[errorCalls.length - 1]?.error;
				toast({
					status: "error",
					title: "Unexpected error",
					description:
						"Unexpected error. Please contact support: none of the calls threw an error",
				});
				throw new Error(
					"Unexpected error. Please contact support: none of the calls threw an error"
				);
			}

			const {
				call: {
					contract,
					parameters: { methodName, args, value },
				},
				// @ts-ignore
				gasEstimate,
			} = successfulEstimation;

			return contract[methodName](...args, {
				gasLimit: calculateGasMargin(gasEstimate),
				...(value && !isZero(value)
					? { value, from: walletAddress }
					: { from: walletAddress }),
			})
				.then((response: TransactionResponse) => {
					const inputSymbol = trade.inputAmount.currency.symbol;
					const outputSymbol = trade.outputAmount.currency.symbol;
					const inputAmount = trade.inputAmount.toSignificant(3);
					const outputAmount = trade.outputAmount.toSignificant(3);

					const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`;
					const withRecipient =
						recipient === walletAddress
							? base
							: `${base} to ${
									recipient && (UseENS(recipient).address as string)
										? shortAddress(recipient)
										: recipient
							  }`;

					const withVersion =
						tradeVersion === "v2"
							? withRecipient
							: `${withRecipient} on ${tradeVersion.toUpperCase()}`;

					addTransactions({
						summary: withVersion,
						hash: response.hash,
						service: "swapCallback",
					});
					setCurrentInputTokenName(`${inputSymbol}`);
					onCloseTransaction();

					return response.hash;
				})
				.catch((error: any) => {
					// if the user rejected the tx, pass this along
					if (error?.code === 4001) {
						onCloseTransaction();
						// throw new Error("Transaction rejected.");
						toast({
							status: "error",
							title: "Transaction rejected by user.",
							description: `Transaction rejected. Code: ${error?.code}`,
						});
					} else {
						onCloseTransaction();
						// otherwise, the error was unexpected and we need to convey that
						console.error(`Swap failed`, error, methodName, args, value);
						toast({
							status: "error",
							title: "Swap failed.",
							description: `Swap has failed`,
						});
						throw new Error(`Swap failed: ${error.message}`);
					}
				});
		},
		error: null,
	};
}
