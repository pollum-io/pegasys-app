import { MaxUint256 } from "@ethersproject/constants";
import { TransactionResponse } from "@ethersproject/providers";
import { Trade, CurrencyAmount, ChainId } from "@pollum-io/pegasys-sdk";
import { ROUTER_ADDRESS } from "helpers/consts";
import {
	calculateGasMargin,
	computeSlippageAdjustedAmounts,
	getContract,
	addTransaction,
	getTokenAllowance,
} from "utils";
import { IWalletHookInfos, ISwapTokenInputValue } from "types";
import { Signer } from "ethers";
import { hasPendingApproval } from "utils/hasPendingApproval";

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
	amountToApprove?: { [field in Field]?: CurrencyAmount },
	spender?: string,
	signer?: Signer,
	setTransactions?: React.Dispatch<React.SetStateAction<object>>,
	transactions?: object,
	walletInfos: IWalletHookInfos
): () => Promise<void> {
	const { walletAddress, chainId } = walletInfos;
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
		const currentAllowance = await getTokenAllowance(
			token,
			walletAddress ?? undefined,
			spender,
			signer
		);

		const pending = hasPendingApproval(
			token?.address,
			spender,
			transactions,
			chainId
		);

		const approvalState: ApprovalState = () => {
			if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;
			if (amountToApprove.currency === NSYS) return ApprovalState.APPROVED;
			// we might not have enough data to know whether or not we need to approve
			if (!currentAllowance) return ApprovalState.UNKNOWN;

			// amountToApprove will be defined if currentAllowance is
			return currentAllowance.lessThan(amountToApprove)
				? pending
					? ApprovalState.PENDING
					: ApprovalState.NOT_APPROVED
				: ApprovalState.APPROVED;
		};
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
					{
						summary: `Approve ${currentAmountToApprove.currency.symbol}`,
						approval: { tokenAddress: token?.address, spender },
					},
					walletInfos,
					setTransactions,
					transactions
				);
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
	allowedSlippage = 0
) {
	const { chainId } = walletInfos;
	const amountToApprove = trade
		? computeSlippageAdjustedAmounts(trade, allowedSlippage)
		: undefined;

	return useApproveCallback(
		userInput,
		amountToApprove,
		chainId ? ROUTER_ADDRESS[chainId] : ROUTER_ADDRESS[ChainId.NEVM],
		signer,
		setTransactions,
		transactions,
		walletInfos
	);
}
