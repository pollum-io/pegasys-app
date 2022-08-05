import { MaxUint256 } from "@ethersproject/constants";
import { TransactionResponse } from "@ethersproject/providers";
import { Trade, CurrencyAmount, ChainId } from "@pollum-io/pegasys-sdk";
import { ROUTER_ADDRESS } from "helpers/consts";
import {
	calculateGasMargin,
	computeSlippageAdjustedAmounts,
	getContract,
} from "utils";
import { IWalletHookInfos, ISwapTokenInputValue } from "types";
import { Signer } from "ethers";

export enum ApprovalState {
	UNKNOWN,
	NOT_APPROVED,
	PENDING,
	APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
	userInput: ISwapTokenInputValue,
	amountToApprove?: CurrencyAmount,
	spender?: string,
	signer?: Signer
): () => Promise<void> {
	const token =
		userInput.lastInputTyped === 0
			? amountToApprove?.INPUT?.token
			: amountToApprove?.OUTPUT?.token;

	const approve = async (): Promise<void> => {
		const tokenContract = await getContract(token?.address, signer as Signer);
		if (!token) {
			console.error("no token");
			return;
		}

		if (!tokenContract) {
			console.error("tokenContract is null");
			return;
		}

		if (!amountToApprove) {
			console.error("missing amount to approve");
			return;
		}

		if (!spender) {
			console.error("no spender");
			return;
		}
		let useExact = false;
		const estimatedGas = await tokenContract.estimateGas
			.approve(spender, MaxUint256)
			.catch(() => {
				// general fallback for tokens who restrict approval amounts
				useExact = true;
				return tokenContract.estimateGas.approve(
					spender,
					amountToApprove.raw.toString()
				);
			});
		// eslint-disable-next-line
		return tokenContract
			.approve(
				spender,
				useExact ? amountToApprove.raw.toString() : MaxUint256,
				{
					gasLimit: calculateGasMargin(estimatedGas),
				}
			)
			.then((response: TransactionResponse) => {
				console.log(response);
			})
			.catch((error: Error) => {
				console.debug("Failed to approve token", error);
				throw error;
			});
	};

	return approve;
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(
	trade: Trade,
	walletInfos: IWalletHookInfos,
	signer: Signer,
	userInput: ISwapTokenInputValue,
	allowedSlippage = 0
) {
	const { chainId } = walletInfos;
	const amountToApprove = trade
		? computeSlippageAdjustedAmounts(trade, allowedSlippage)
		: undefined;

	return useApproveCallback(
		userInput,
		amountToApprove as CurrencyAmount,
		chainId ? ROUTER_ADDRESS[chainId] : ROUTER_ADDRESS[ChainId.NEVM],
		signer
	);
}
