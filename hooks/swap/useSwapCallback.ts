/* eslint-disable */
import {
	JSBI,
	Percent,
	Router,
	SwapParameters,
	Trade,
	TradeType,
} from "@pollum-io/pegasys-sdk";
import { Signer } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useMemo, useEffect } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import pegasysAbi from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-periphery/interfaces/IPegasysRouter.sol/IPegasysRouter.json";
import { useWallet, useENS } from "hooks";
import erc20ABI from "utils/abis/erc20.json";
import {
	calculateGasMargin,
	createContractUsingAbi,
	isZero,
	shortAddress,
} from "utils";
import { IWalletHookInfos } from "types";

interface SwapCall {
	contract: Contract;
	parameters: SwapParameters;
}

export enum SwapCallbackState {
	INVALID,
	LOADING,
	VALID,
}

const INITIAL_ALLOWED_SLIPPAGE = 50;

const BIPS_BASE = JSBI.BigInt(10000);

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
function getSwapArguments(
	trade: Trade | undefined, // trade to execute, required  // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
	allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
	walletInfos: IWalletHookInfos,
	signer: Signer
): SwapCall[] {
	const { walletAddress, chainId: chain } = walletInfos;

	const { address: recipientAddress } = useENS(walletAddress);

	const recipient =
	recipientAddress === null ? walletAddress : recipientAddress;
	let deadline: any;

	const currentTime = BigNumber.from(new Date().getTime());

	deadline = currentTime.add(10);
	const tradeVersion = "v2";

	const contract: Contract | null = createContractUsingAbi(
		walletAddress,
		pegasysAbi.abi,
		signer
	);

	if (!contract) {
		return [];
	}

	return [];
}

export function UseSwapCallback(
	trade: Trade | undefined, // trade to execute, required
	allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
	walletInfos: IWalletHookInfos,
	signer: Signer
) {
	const { walletAddress, chainId: chain } = walletInfos;

	const swapCalls = getSwapArguments(
		trade,
		allowedSlippage,
		walletInfos,
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
		if (recipientAddressOrName !== null) {
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
			const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
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
				(el, ix, list): el is SuccessfulCall =>
					"gasEstimate" in el &&
					(ix === list.length - 1 || "gasEstimate" in list[ix + 1])
			);

			if (!successfulEstimation) {
				const errorCalls = estimatedCalls.filter(
					(call): call is FailedCall => "error" in call
				);
				if (errorCalls.length > 0)
					throw errorCalls[errorCalls.length - 1].error;
				throw new Error(
					"Unexpected error. Please contact support: none of the calls threw an error"
				);
			}

			const {
				call: {
					contract,
					parameters: { methodName, args, value },
				},
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
									recipientAddressOrName && isAddress(recipientAddressOrName)
										? shortAddress(recipientAddressOrName)
										: recipientAddressOrName
							  }`;

					const withVersion =
						tradeVersion === "v2"
							? withRecipient
							: `${withRecipient} on ${tradeVersion.toUpperCase()}`;

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
