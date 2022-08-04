import { BIPS_BASE, INITIAL_ALLOWED_SLIPPAGE } from "helpers/consts";
import { BigNumber } from "@ethersproject/bignumber";
import {
	Trade,
	JSBI,
	Percent,
	Router,
	TradeType,
	SwapParameters,
} from "@pollum-io/pegasys-sdk";
import { useTransactionDeadline } from "./useTransactionDeadline";

export function UseBestSwapMethod(
	v2Trade: Trade,
	walletAddress: string
): string[] {
	let deadline = useTransactionDeadline();

	const currentTime = BigNumber.from(new Date().getTime());

	if (deadline && deadline < currentTime.add(10)) {
		deadline = currentTime.add(10);
	}

	const bestSwapMethods = [] as SwapParameters[];

	bestSwapMethods.push(
		Router.swapCallParameters(v2Trade as Trade, {
			feeOnTransfer: false,
			allowedSlippage: new Percent(
				JSBI.BigInt(INITIAL_ALLOWED_SLIPPAGE),
				BIPS_BASE
			),
			recipient: walletAddress,
			deadline: deadline?.toNumber() as number,
		})
	);

	if (v2Trade?.tradeType === TradeType.EXACT_INPUT) {
		bestSwapMethods.push(
			Router.swapCallParameters(v2Trade, {
				feeOnTransfer: true,
				allowedSlippage: new Percent(
					JSBI.BigInt(INITIAL_ALLOWED_SLIPPAGE),
					BIPS_BASE
				),
				recipient: walletAddress,
				deadline: deadline?.toNumber() as number,
			})
		);
	}

	return bestSwapMethods.map((method: SwapParameters) => method.methodName);
}
