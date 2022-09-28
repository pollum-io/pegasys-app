import { MaxUint256 } from "@ethersproject/constants";
import { ChainId, Currency, NSYS, TokenAmount } from "@pollum-io/pegasys-sdk";
import { ApprovalState } from "hooks";
import { ContractFramework } from "pegasys-services/frameworks";

class TokenServices {
	static async approve(
		// address: string,
		amountToApprove: TokenAmount,
		spender: string
	) {
		// const { account } = useActiveWeb3React();
		// const token =
		// 	amountToApprove instanceof TokenAmount
		// 		? amountToApprove.token
		// 		: undefined;

		const contract = ContractFramework.TokenContract(
			amountToApprove.token.address
		);

		// const currentAllowance = await ContractFramework.call({
		// 	contract,
		// 	methodName: "allowance",
		// 	args: [address, spender],
		// });

		// const currentAllowance = useTokenAllowance(
		// // 	token,
		// // 	account ?? undefined,
		// // 	spender
		// // );
		// const pendingApproval = useHasPendingApproval(token?.address, spender);

		// check the current approval status

		// const pendingApproval = false;

		// let approvalState: ApprovalState;

		// if (!amountToApprove || !spender || !currentAllowance) {
		// 	approvalState = ApprovalState.UNKNOWN;
		// } else if (amountToApprove.currency === NSYS) {
		// 	approvalState = ApprovalState.APPROVED;
		// } else {
		// 	approvalState = currentAllowance.lessThan(amountToApprove)
		// 		? pendingApproval
		// 			? ApprovalState.PENDING
		// 			: ApprovalState.NOT_APPROVED
		// 		: ApprovalState.APPROVED;
		// }

		// const tokenContract = useTokenContract(token?.address);
		// const addTransaction = useTransactionAdder();

		// const approve = useCallback(async (): Promise<void> => {
		// if (approvalState !== ApprovalState.NOT_APPROVED) {
		// 	console.error("approve was called unnecessarily");
		// 	return undefined;
		// }
		if (!amountToApprove.token) {
			console.error("no token");
			return;
		}

		if (!contract) {
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
		await contract.estimateGas.approve(spender, MaxUint256).catch(() => {
			// general fallback for tokens who restrict approval amounts
			useExact = true;
			return contract.estimateGas.approve(
				spender,
				amountToApprove.raw.toString()
			);
		});

		await ContractFramework.call({
			contract,
			methodName: "approve",
			args: [spender, useExact ? amountToApprove.raw.toString() : MaxUint256],
		});

		// return approvalState;
	}

	static async usdcPrice(currency: Currency, chainId?: ChainId) {}
}

export default TokenServices;
