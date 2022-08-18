import {
	BIPS_BASE,
	INITIAL_ALLOWED_SLIPPAGE,
	ROUTER_ADDRESS,
} from "helpers/consts";
import { BigNumber } from "@ethersproject/bignumber";
import {
	Trade,
	JSBI,
	Percent,
	Router,
	TradeType,
	SwapParameters,
} from "@pollum-io/pegasys-sdk";
import { Signer } from "ethers";
import pegasysAbi from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-periphery/interfaces/IPegasysRouter.sol/IPegasysRouter.json";
import { createContractUsingAbi } from "utils";
import { ISwapCall } from "types/ISwapCall";
import { IWalletHookInfos } from "types";
import { useTransactionDeadline } from "./useTransactionDeadline";

export function UseBestSwapMethod(
	v2Trade: Trade,
	walletAddress: string,
	signer: Signer,
	walletInfos: IWalletHookInfos
): ISwapCall[] {
	let deadline = useTransactionDeadline();
	const chainId = walletInfos?.chainId;

	if (!v2Trade || !walletAddress) return [];

	const currentTime = BigNumber.from(new Date().getTime());

	if (deadline && deadline < currentTime.add(10)) {
		deadline = currentTime.add(10);
	}

	const contract =
		chainId &&
		createContractUsingAbi(
			ROUTER_ADDRESS[chainId],
			pegasysAbi.abi,
			signer as Signer
		);

	if (!contract) {
		return [];
	}

	const bestSwapMethods: SwapParameters[] = [];

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

	return bestSwapMethods.map(parameters => ({ parameters, contract }));
}
