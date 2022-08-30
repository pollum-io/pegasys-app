import { MaxUint256 } from "@ethersproject/constants";
import { Trade, ChainId, TokenAmount, Token } from "@pollum-io/pegasys-sdk";
import { UseToastOptions } from "@chakra-ui/react";
import { ROUTER_ADDRESS } from "helpers/consts";
import {
	addTransaction,
	calculateGasMargin,
	computeSlippageAdjustedAmounts,
	getContract,
	getTokenAllowance,
} from "utils";
import {
	IWalletHookInfos,
	ISwapTokenInputValue,
	ITx,
	ITransactionResponse,
} from "types";
import { Signer } from "ethers";
import { IApprovalState, ISubmittedAproval } from "contexts";

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

interface IError {
	code: number;
	message: string;
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
	userInput: ISwapTokenInputValue,
	setApprovalState: React.Dispatch<React.SetStateAction<IApprovalState>>,
	walletInfos: IWalletHookInfos,
	toast: React.Dispatch<React.SetStateAction<UseToastOptions>>,
	setTransactions: React.Dispatch<React.SetStateAction<ITx>>,
	transactions: ITx,
	setApprovalSubmitted: React.Dispatch<React.SetStateAction<ISubmittedAproval>>,
	setCurrentTxHash: React.Dispatch<React.SetStateAction<string>>,
	setCurrentInputTokenName: React.Dispatch<React.SetStateAction<string>>,
	setApproveTokenStatus: React.Dispatch<React.SetStateAction<ApprovalState>>,
	amountToApprove?: { [field in Field]?: TokenAmount },
	spender?: string,
	signer?: Signer
) {
	const token = (
		userInput.lastInputTyped === 0
			? amountToApprove?.INPUT?.token
			: amountToApprove?.OUTPUT?.token
	) as Token;

	const currentAmountToApprove =
		userInput.lastInputTyped === 0
			? amountToApprove?.INPUT
			: amountToApprove?.OUTPUT;

	getTokenAllowance(
		token,
		walletInfos.walletAddress && walletInfos.walletAddress,
		`${spender}`,
		signer as Signer
	).then(result => {
		// eslint-disable-next-line
		result && currentAmountToApprove instanceof TokenAmount
			? result?.lessThan(currentAmountToApprove)
				? setApproveTokenStatus(ApprovalState.NOT_APPROVED)
				: setApproveTokenStatus(ApprovalState.APPROVED)
			: result;
	});

	const approve = async (): Promise<void> => {
		const tokenContract = await getContract(token?.address, signer as Signer);
		if (!token) {
			throw new Error("No token informed");
		}

		if (!tokenContract) {
			throw new Error("Token Contract is null");
		}

		if (!amountToApprove) {
			throw new Error("Missing amount to approve");
		}

		if (!spender) {
			throw new Error("No Spender");
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
				setApprovalSubmitted(prevState => ({
					status: true,
					tokens: [
						...prevState.tokens,
						`${currentAmountToApprove?.currency?.symbol}`,
					],
				}));
				setCurrentTxHash(`${response?.hash}`);
				setCurrentInputTokenName(`${currentAmountToApprove?.currency?.symbol}`);
			})
			.catch((error: IError) => {
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
	setApprovalSubmitted: React.Dispatch<React.SetStateAction<ISubmittedAproval>>,
	setCurrentTxHash: React.Dispatch<React.SetStateAction<string>>,
	setCurrentInputTokenName: React.Dispatch<React.SetStateAction<string>>,
	setApproveTokenStatus: React.Dispatch<React.SetStateAction<ApprovalState>>,
	allowedSlippage = 0
) {
	const { chainId } = walletInfos;
	const amountToApprove = computeSlippageAdjustedAmounts(
		trade,
		allowedSlippage
	) as { [field in Field]?: TokenAmount };

	return useApproveCallback(
		userInput,
		setApprovalState,
		walletInfos,
		toast,
		setTransactions,
		transactions,
		setApprovalSubmitted,
		setCurrentTxHash,
		setCurrentInputTokenName,
		setApproveTokenStatus,
		amountToApprove,
		chainId ? ROUTER_ADDRESS[chainId] : ROUTER_ADDRESS[ChainId.NEVM],
		signer
	);
}
