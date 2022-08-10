/* eslint-disable */
import { Trade } from "@pollum-io/pegasys-sdk";
import { Signer } from "ethers";
import { useENS } from "hooks";
import { calculateGasMargin, isZero, shortAddress, isAddress } from "utils";
import { IWalletHookInfos } from "types";
import { addTransaction } from "utils/addTransaction";
import { UseBestSwapMethod } from "./useBestSwapMethod";

export enum SwapCallbackState {
	INVALID,
	LOADING,
	VALID,
}

export function UseSwapCallback(
	trade: Trade | undefined, // trade to execute, required
	allowedSlippage: number, // in bips
	walletInfos: IWalletHookInfos,
	signer: Signer,
	setTransactions: React.Dispatch<React.SetStateAction<object>>,
	transactions: object
) {
	const { walletAddress, chainId: chain } = walletInfos;

	const swapCalls = UseBestSwapMethod(
		trade as Trade,
		walletInfos.walletAddress,
		signer
	);

	const { address: recipientAddress } = useENS(walletAddress);
	const recipient =
		recipientAddress === null ? walletAddress : recipientAddress;

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
				.then((response: any) => {
					const inputSymbol = trade.inputAmount.currency.symbol;
					const outputSymbol = trade.outputAmount.currency.symbol;
					const inputAmount = trade.inputAmount.toSignificant(3);
					const outputAmount = trade.outputAmount.toSignificant(3);

					const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`;
					const withRecipient =
						recipient === walletAddress
							? base
							: `${base} to ${
									recipient && isAddress(recipient)
										? shortAddress(recipient)
										: recipient
							  }`;

					const withVersion =
						tradeVersion === "v2"
							? withRecipient
							: `${withRecipient} on ${tradeVersion.toUpperCase()}`;

					addTransaction(
						response,
						{
							summary: withVersion,
						},
						walletInfos,
						setTransactions,
						transactions
					);

					return response.hash;
				})
				.catch((error: any) => {
					// if the user rejected the tx, pass this along
					if (error?.code === 4001) {
						// throw new Error("Transaction rejected.");
						console.log("transaction rejected");
					} else {
						// otherwise, the error was unexpected and we need to convey that
						console.error(`Swap failed`, error, methodName, args, value);
						throw new Error(`Swap failed: ${error.message}`);
					}
				});
		},
		error: null,
	};
}
