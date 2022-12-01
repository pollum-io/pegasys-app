import { MaxUint256 } from "@ethersproject/constants";
import { Trade, ChainId, TokenAmount, Token } from "@pollum-io/pegasys-sdk";
import { UseToastOptions } from "@chakra-ui/react";
import { PegasysContracts, useTransaction } from "pegasys-services";
import {
	calculateGasMargin,
	computeSlippageAdjustedAmounts,
	getContract,
	getTokenAllowance,
} from "utils";
import {
	IWalletHookInfos,
	ISwapTokenInputValue,
	ITransactionResponse,
} from "types";
import { Signer } from "ethers";
import abi20 from "utils/abis/erc20.json";

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
	walletInfos: IWalletHookInfos,
	toast: React.Dispatch<React.SetStateAction<UseToastOptions>>,
	setCurrentInputTokenName: React.Dispatch<React.SetStateAction<string>>,
	setApproveTokenStatus: React.Dispatch<React.SetStateAction<ApprovalState>>,
	onCloseTransaction: () => void,
	amountToApprove?: { [field in Field]?: TokenAmount },
	spender?: string,
	signer?: Signer
) {
	const { addTransactions } = useTransaction();

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
		const tokenContract = await getContract(
			token?.address,
			signer as Signer,
			abi20
		);
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
				addTransactions({
					hash: response.hash,
					summary: `Approve ${currentAmountToApprove?.currency?.symbol}`,
					service: "useApproveCallback",
				});
				setCurrentInputTokenName(`${currentAmountToApprove?.currency?.symbol}`);
				onCloseTransaction();
			})
			.catch((error: IError) => {
				if (error?.code === 4001) {
					onCloseTransaction();
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
	toast: React.Dispatch<React.SetStateAction<UseToastOptions>>,
	setCurrentInputTokenName: React.Dispatch<React.SetStateAction<string>>,
	setApproveTokenStatus: React.Dispatch<React.SetStateAction<ApprovalState>>,
	onCloseTransaction: () => void,
	allowedSlippage = 0
) {
	const { chainId } = walletInfos;
	const amountToApprove = computeSlippageAdjustedAmounts(
		trade,
		allowedSlippage
	) as { [field in Field]?: TokenAmount };

	return useApproveCallback(
		userInput,
		walletInfos,
		toast,
		setCurrentInputTokenName,
		setApproveTokenStatus,
		onCloseTransaction,
		amountToApprove,
		PegasysContracts[chainId ?? ChainId.NEVM].ROUTER_ADDRESS,
		signer
	);
}
