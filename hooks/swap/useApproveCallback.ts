import { MaxUint256 } from "@ethersproject/constants";
import { TransactionResponse } from "@ethersproject/providers";
import { Trade, CurrencyAmount, ChainId } from "@pollum-io/pegasys-sdk";
import { ROUTER_ADDRESS } from "helpers/consts";
import {
	calculateGasMargin,
	computeSlippageAdjustedAmounts,
	getContract,
	addTransaction,
} from "utils";
import { IWalletHookInfos, ISwapTokenInputValue } from "types";
import { Signer } from "ethers";

export enum ApprovalState {
	UNKNOWN,
	NOT_APPROVED,
	PENDING,
	APPROVED,
}

export enum Field {
	INPUT = "INPUT",
	OUTPUT = "OUTPUT",
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
	userInput: ISwapTokenInputValue,
	setApprovalState: React.Dispatch<React.SetStateAction<ApprovalState>>,
	walletInfos: IWalletHookInfos,
	setTransactions: React.Dispatch<React.SetStateAction<object>>,
	amountToApprove?: { [field in Field]?: CurrencyAmount },
	spender?: string,
	signer?: Signer,
	transactions?: object
): () => Promise<void> {
	const token =
		userInput.lastInputTyped === 0
			? amountToApprove?.INPUT?.token
			: amountToApprove?.OUTPUT?.token;

	const currentAmountToApprove =
		userInput.lastInputTyped === 0
			? amountToApprove?.INPUT
			: amountToApprove?.OUTPUT;

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
					currentAmountToApprove?.raw.toString()
				);
			});
		// eslint-disable-next-line
		return tokenContract
			.approve(
				spender,
				useExact ? currentAmountToApprove?.raw.toString() : MaxUint256,
				{
					gasLimit: calculateGasMargin(estimatedGas),
				}
			)
			.then((response: TransactionResponse) => {
				addTransaction(
					response,
					walletInfos,
					setTransactions,
					{
						summary: `Approve ${currentAmountToApprove?.currency?.symbol}`,
						approval: { tokenAddress: token?.address, spender },
					},
					transactions
				);
				setApprovalState(ApprovalState.PENDING);
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
	setTransactions: React.Dispatch<React.SetStateAction<object>>,
	transactions: object,
	setApprovalState: React.Dispatch<React.SetStateAction<ApprovalState>>,
	allowedSlippage = 0
) {
	const { chainId } = walletInfos;
	const amountToApprove = trade
		? computeSlippageAdjustedAmounts(trade, allowedSlippage)
		: undefined;

	return useApproveCallback(
		userInput,
		setApprovalState,
		walletInfos,
		setTransactions,
		amountToApprove,
		chainId ? ROUTER_ADDRESS[chainId] : ROUTER_ADDRESS[ChainId.NEVM],
		signer,
		transactions
	);
}
