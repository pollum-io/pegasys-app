import { MaxUint256 } from "@ethersproject/constants";
import { Trade, CurrencyAmount, ChainId } from "@pollum-io/pegasys-sdk";
import { UseToastOptions } from "@chakra-ui/react";
import { ROUTER_ADDRESS } from "helpers/consts";
import {
	addTransaction,
	calculateGasMargin,
	computeSlippageAdjustedAmounts,
	getContract,
} from "utils";
import {
	IWalletHookInfos,
	ISwapTokenInputValue,
	ITx,
	ITransactionResponse,
} from "types";
import { Signer } from "ethers";
import { IApprovalState } from "contexts";

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
	setApprovalState: React.Dispatch<React.SetStateAction<IApprovalState>>,
	walletInfos: IWalletHookInfos,
	toast: React.Dispatch<React.SetStateAction<UseToastOptions>>,
	setTransactions: React.Dispatch<React.SetStateAction<ITx>>,
	transactions: ITx,
	amountToApprove?: { [field in Field]?: CurrencyAmount },
	spender?: string,
	signer?: Signer
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
			.then((response: ITransactionResponse) => {
				addTransaction(response, walletInfos, setTransactions, transactions, {
					summary: `Approve ${currentAmountToApprove?.currency?.symbol}`,
					approval: { tokenAddress: token?.address, spender },
				});
				setApprovalState({ status: ApprovalState.PENDING, type: "approve" });
			})
			.catch(error => {
				if (error?.code === 4001) {
					toast({
						status: "error",
						title: "Transaction rejected by user.",
						description: `Transaction rejected. Code: ${error?.code}`,
					});
				}
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
	setApprovalState: React.Dispatch<React.SetStateAction<IApprovalState>>,
	setTransactions: React.Dispatch<React.SetStateAction<ITx>>,
	transactions: ITx,
	toast: React.Dispatch<React.SetStateAction<UseToastOptions>>,
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
		toast,
		setTransactions,
		transactions,
		amountToApprove,
		chainId ? ROUTER_ADDRESS[chainId] : ROUTER_ADDRESS[ChainId.NEVM],
		signer
	);
}
