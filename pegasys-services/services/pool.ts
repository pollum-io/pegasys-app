import {
	ChainId,
	CurrencyAmount,
	JSBI,
	NSYS,
	Pair,
	TokenAmount,
} from "@pollum-io/pegasys-sdk";
import IPegasysRouterABI from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-periphery/interfaces/IPegasysRouter.sol/IPegasysRouter.json";

import { ITransactionResponse, WrappedTokenInfo } from "types";
import { tryParseAmount, wrappedCurrencyAmount, wrappedCurrency } from "utils";
import { ApprovalState } from "contexts";
import { MaxUint256 } from "@ethersproject/constants";
import { BigNumber } from "@ethersproject/bignumber";
import { ContractFramework, WalletFramework } from "../frameworks";
import {
	IPoolServicesApproveProps,
	IPoolServicesGetCurrencyAmountsProps,
} from "../dto";
import { ROUTER_ADDRESS } from "../constants";

class PoolServices {
	static async getCurrencyAmounts(props: IPoolServicesGetCurrencyAmountsProps) {
		const { a, b, noLiquidity, pair } = props;

		const { chainId } = await WalletFramework.getConnectionInfo();

		const independent = a.independent ? a : b;
		const dependent = a.independent ? b : a;

		const independentValue = tryParseAmount(
			independent.value,
			independent.currency
		);

		let dependentValue: CurrencyAmount | undefined;

		if (noLiquidity) {
			if (dependent.value && dependent.currency) {
				dependentValue = tryParseAmount(dependent.value, dependent.currency);
			}
		} else if (independentValue) {
			const wrappedIndependentAmount = wrappedCurrencyAmount(
				independentValue,
				chainId
			);

			const [tokenA, tokenB] = [
				wrappedCurrency(a.currency, chainId),
				wrappedCurrency(b.currency, chainId),
			];

			if (tokenA && tokenB && wrappedIndependentAmount && pair) {
				const dependentTokenAmount = a.independent
					? pair.priceOf(tokenA).quote(wrappedIndependentAmount)
					: pair.priceOf(tokenB).quote(wrappedIndependentAmount);

				dependentValue =
					dependent.currency === NSYS
						? CurrencyAmount.ether(dependentTokenAmount.raw)
						: dependentTokenAmount;
			}
		}

		return {
			a: a.independent ? independentValue : dependentValue,
			b: a.independent ? dependentValue : independentValue,
		};
	}

	static async addLiquidity(props: {
		tokens: [WrappedTokenInfo, WrappedTokenInfo];
		values: [string, string];
		haveValue?: boolean;
		pair: Pair | null;
		slippage: number;
		userDeadline: number | BigNumber;
	}) {
		const { tokens, values, haveValue, pair, slippage, userDeadline } = props;
		const { chainId, address } = await WalletFramework.getConnectionInfo();

		const router = chainId
			? ROUTER_ADDRESS[chainId as ChainId]
			: ROUTER_ADDRESS[ChainId.NEVM];

		const contract = ContractFramework.getContract({
			address: router,
			abi: IPegasysRouterABI.abi,
		});

		let args;
		let value: any;

		const isAnyNSYS = tokens.find(c => c === NSYS);

		const [tokenA, tokenB] = tokens;

		if (!pair) {
			return undefined;
		}

		const parsedAmount = await this.getCurrencyAmounts({
			a: {
				currency: tokenA,
				value: values[0],
				independent: true,
			},
			b: {
				currency: tokenB,
				value: values[1],
			},
			noLiquidity: haveValue,
			pair,
		});

		if (!parsedAmount.a || !parsedAmount.b) {
			return undefined;
		}

		const amountsMin = {
			a: this.calculateSlippageAmount(
				parsedAmount.a,
				haveValue ? 0 : slippage
			)[0],
			b: this.calculateSlippageAmount(
				parsedAmount.b,
				haveValue ? 0 : slippage
			)[0],
		};

		const deadline = BigNumber.from(new Date().getTime() + 100000).add(
			userDeadline
		);

		let methodName: string;

		if (isAnyNSYS) {
			const tokenBIsETH = tokenB === NSYS;

			methodName = "addLiquiditySYS";

			args = [
				(tokenBIsETH ? tokenA : tokenB).address ?? "",
				(tokenBIsETH ? parsedAmount.a : parsedAmount.b).raw.toString(),
				amountsMin[tokenBIsETH ? "a" : "b"].toString(),
				amountsMin[tokenBIsETH ? "b" : "a"].toString(),
				address,
				deadline.toHexString() ?? "",
			];
			value = BigNumber.from(
				(tokenBIsETH ? parsedAmount.b : parsedAmount.a).raw.toString()
			);
		} else {
			methodName = "addLiquidity";

			args = [
				tokenA.address ?? "",
				tokenB.address ?? "",
				parsedAmount.a.raw.toString(),
				parsedAmount.b.raw.toString(),
				amountsMin.a.toString(),
				amountsMin.b.toString(),
				address,
				deadline.toHexString() ?? "",
			];
		}

		const result = await ContractFramework.call({
			contract,
			methodName,
			args,
			value,
		});

		return result;
	}

	static async approve(
		props: IPoolServicesApproveProps
	): Promise<
		| { spender: string; hash: string; response: ITransactionResponse }
		| undefined
	> {
		const { amountToApprove, approvalState } = props;

		const { chainId } = await WalletFramework.getConnectionInfo();

		const spender = chainId
			? ROUTER_ADDRESS[chainId as ChainId]
			: ROUTER_ADDRESS[ChainId.NEVM];

		let txHash = "";
		let txResponse: ITransactionResponse | any = null;
		const token =
			amountToApprove instanceof TokenAmount
				? amountToApprove.token
				: undefined;

		if (token) {
			const contract = ContractFramework.TokenContract(token.address);

			if (approvalState !== ApprovalState.NOT_APPROVED) {
				console.error("approve was called unnecessarily");
				return undefined;
			}
			if (!token) {
				console.error("no token");
				return undefined;
			}

			if (!contract) {
				console.error("tokenContract is null");
				return undefined;
			}

			if (!amountToApprove) {
				console.error("missing amount to approve");
				return undefined;
			}

			if (!spender) {
				console.error("no spender");
				return undefined;
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
				methodName: "approve",
				contract,
				args: [spender, useExact ? amountToApprove.raw.toString() : MaxUint256],
			}).then((res: ITransactionResponse) => {
				txHash = `${res?.hash}`;
				txResponse = res;
			});

			return {
				spender,
				hash: txHash,
				response: txResponse,
			};
		}

		return undefined;
	}

	static calculateSlippageAmount(
		value: CurrencyAmount,
		slippage: number
	): [JSBI, JSBI] {
		if (slippage < 0 || slippage > 10000) {
			throw Error(`Unexpected slippage value: ${slippage}`);
		}
		return [
			JSBI.divide(
				JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)),
				JSBI.BigInt(10000)
			),
			JSBI.divide(
				JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)),
				JSBI.BigInt(10000)
			),
		];
	}
}

export default PoolServices;
