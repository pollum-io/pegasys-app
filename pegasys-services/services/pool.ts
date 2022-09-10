import {
	ChainId,
	Currency,
	CurrencyAmount,
	JSBI,
	NSYS,
	Pair,
	// NSYS,
	// Pair,
	// Token,
	TokenAmount,
} from "@pollum-io/pegasys-sdk";
import IPegasysRouterABI from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-periphery/interfaces/IPegasysRouter.sol/IPegasysRouter.json";

import { WrappedTokenInfo } from "types";
import { tryParseAmount, wrappedCurrencyAmount, wrappedCurrency } from "utils";
import { usePairs } from "hooks";
import { ApprovalState } from "contexts";
import { MaxUint256 } from "@ethersproject/constants";
import { BigNumber } from "@ethersproject/bignumber";
import {
	ContractFramework,
	// TokenFramework,
	WalletFramework,
} from "../frameworks";
import {
	IPoolServicesApproveProps,
	// IPoolServicesGetCurrencyAmountProps,
	IPoolServicesGetCurrencyAmountsProps,
} from "../dto";
// import {
//     IPoolServicesAddLiquidityProps,
//     IPoolServicesGetPairValuesProps
// } from '../dto'
import { ROUTER_ADDRESS } from "../constants";

class PoolServices {
	// private readonly contractFramework = new ContractFramework()
	// private readonly tokenFramework = new TokenFramework()

	// private getPairValues(props: IPoolServicesGetPairValuesProps) {
	//     const independentIndex = props.currency[0].independent ? 0 : 1
	//     const dependentIndex = independentIndex ? 0 : 1

	//     const independentValue = this.tokenFramework.getAmount(
	//         props.currency[independentIndex].currency,
	//         props.currency[independentIndex].value
	//     )

	//     let dependentValue = undefined

	//     if (props.noLiquidity) {
	//         dependentValue = this.tokenFramework.getAmount(
	//             props.currency[dependentIndex].currency,
	//             props.currency[dependentIndex].value
	//         )
	//     } else if (independentValue) {
	//         const wrappedIndependentAmount = this.tokenFramework.wrappedCurrencyAmount(
	//             independentValue,
	//             props.chainId
	//         )

	//         const [tokenA, tokenB] = [
	//             this.tokenFramework.wrappedCurrency(props.currency[0].currency, props.chainId),
	//             this.tokenFramework.wrappedCurrency(props.currency[1].currency, props.chainId)
	//         ]

	//         if (tokenA && tokenB && wrappedIndependentAmount) {
	//             const pair = new Pair(
	//                 this.tokenFramework.getAmount(tokenA, props.currency[0].value) as any,
	//                 this.tokenFramework.getAmount(tokenB, props.currency[1].value) as any,
	//                 props.chainId
	//             )

	//             const dependentCurrency = props.currency[dependentIndex].currency

	//             const dependentTokenAmount =
	//                 dependentIndex === 1
	//                     ? pair.priceOf(tokenA).quote(wrappedIndependentAmount)
	//                     : pair.priceOf(tokenB).quote(wrappedIndependentAmount)

	//             dependentValue = dependentCurrency === NSYS
	//                 ? CurrencyAmount.ether(dependentTokenAmount.raw)
	//                 : dependentTokenAmount
	//         }
	//     }

	//     return independentIndex
	//         ? [dependentValue, independentValue]
	//         : [independentValue, dependentValue]
	// }

	// async addLiquidity(props: IPoolServicesAddLiquidityProps) {
	//     const tokens = props.currencyPair.map(c => this.tokenFramework.getToken(c.id))

	//     const [tokenA, tokenB] = tokens

	//     let args
	//     let value

	//     const isAnyNSYS = tokens.find(c => c === NSYS)

	//     if (isAnyNSYS) {
	//         const tokenBIsETH = tokens[1] === NSYS

	//         args = [
	//             (tokenBIsETH
	//                 ? tokenA as Token
	//                 : tokenB as Token
	//             ).address ?? '',
	//             (tokenBIsETH ? currencyPair[0] : currencyPair[1], chainId)?.address ?? '',
	//             (tokenBIsETH ? parsedAmount[0] : parsedAmount[1]).raw.toString(),
	//             amountsMin[tokenBIsETH ? 0 : 1].toString(),
	//             amountsMin[tokenBIsETH ? 1 : 0].toString(),
	//             account,
	//             deadline.toHexString()
	//         ]
	//         value = BigNumber.from((tokenBIsETH ? parsedAmount[1] : parsedAmount[0]).raw.toString())
	//     } else {
	//         args = [
	//             ch.wrap(currencyPair[0], chainId)?.address ?? '',
	//             ch.wrap(currencyPair[1], chainId)?.address ?? '',
	//             parsedAmount[0].raw.toString(),
	//             parsedAmount[1].raw.toString(),
	//             amountsMin[0].toString(),
	//             amountsMin[1].toString(),
	//             props.address,
	//             deadline.toHexString()
	//         ]
	//     }

	// }

	// async removeLiquidity() {
	//     console.log('remove liquidity')
	// }

	// async createPair() {

	// }

	// private static async getCurrencyAmount(
	// 	props: IPoolServicesGetCurrencyAmountProps
	// ) {
	// 	const { independent, value, currency } = props;

	// 	let currencyAmount: CurrencyAmount | undefined;

	// 	if (independent) {
	// 		currencyAmount = tryParseAmount(value, currency);
	// 	} else if (props.noLiquidity) {
	// 	} else {
	// 	}
	// }

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

	// static async approveAddLiquidity(props: {
	// 	amountToApprove: CurrencyAmount;
	// 	pendingApproval?: boolean;
	// }) {
	// 	const { amountToApprove } = props;

	// 	const { address, chainId } = await WalletFramework.getConnectionInfo();

	// 	const spender = chainId
	// 		? ROUTER_ADDRESS[chainId as ChainId]
	// 		: ROUTER_ADDRESS[ChainId.NEVM];

	// 	const token =
	// 		amountToApprove instanceof TokenAmount
	// 			? amountToApprove.token
	// 			: undefined;

	// 	if (token) {
	// 		const contract = ContractFramework.TokenContract(token.address);

	// 		const allowance = await ContractFramework.call({
	// 			contract,
	// 			args: [address, spender],
	// 			methodName: "allowance",
	// 		});

	// 		const currentAllowance = allowance
	// 			? new TokenAmount(token, allowance.toString())
	// 			: undefined;

	// 		let approvalState: ApprovalState;

	// 		if (!amountToApprove || !spender) {
	// 			approvalState = ApprovalState.UNKNOWN;
	// 		} else if (amountToApprove.currency === NSYS) {
	// 			approvalState = ApprovalState.APPROVED;
	// 		} else if (!currentAllowance) {
	// 			approvalState = ApprovalState.UNKNOWN;
	// 		} else {
	// 			approvalState = currentAllowance.lessThan(amountToApprove)
	// 				? props.pendingApproval
	// 					? ApprovalState.PENDING
	// 					: ApprovalState.NOT_APPROVED
	// 				: ApprovalState.APPROVED;
	// 		}

	// 		if (approvalState !== ApprovalState.NOT_APPROVED) {
	// 			console.error("approve was called unnecessarily");
	// 			return;
	// 		}
	// 		if (!token) {
	// 			console.error("no token");
	// 			return;
	// 		}

	// 		if (!tokenContract) {
	// 			console.error("tokenContract is null");
	// 			return;
	// 		}

	// 		if (!amountToApprove) {
	// 			console.error("missing amount to approve");
	// 			return;
	// 		}

	// 		if (!spender) {
	// 			console.error("no spender");
	// 			return;
	// 		}

	// 		let useExact = false;
	// 		const estimatedGas = await tokenContract.estimateGas
	// 			.approve(spender, MaxUint256)
	// 			.catch(() => {
	// 				// general fallback for tokens who restrict approval amounts
	// 				useExact = true;
	// 				return tokenContract.estimateGas.approve(
	// 					spender,
	// 					amountToApprove.raw.toString()
	// 				);
	// 			});

	// 		return tokenContract
	// 			.approve(
	// 				spender,
	// 				useExact ? amountToApprove.raw.toString() : MaxUint256,
	// 				{
	// 					gasLimit: calculateGasMargin(estimatedGas),
	// 				}
	// 			)
	// 			.then((response: TransactionResponse) => {
	// 				addTransaction(response, {
	// 					summary: `Approve ${amountToApprove.currency.symbol}`,
	// 					approval: { tokenAddress: token.address, spender },
	// 				});
	// 			})
	// 			.catch((error: Error) => {
	// 				console.debug("Failed to approve token", error);
	// 				throw error;
	// 			});

	// 		// const tokenAmount = new TokenAmount(token, allowance.toString())
	// 	}

	// 	// const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
	// 	// const pendingApproval = useHasPendingApproval(token?.address, spender)

	// 	// // check the current approval status
	// 	// const approvalState: ApprovalState = useMemo(() => {
	// 	//     if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
	// 	//     if (amountToApprove.currency === NSYS) return ApprovalState.APPROVED
	// 	//     // we might not have enough data to know whether or not we need to approve
	// 	//     if (!currentAllowance) return ApprovalState.UNKNOWN

	// 	//     // amountToApprove will be defined if currentAllowance is
	// 	//     return currentAllowance.lessThan(amountToApprove)
	// 	//         ? pendingApproval
	// 	//             ? ApprovalState.PENDING
	// 	//             : ApprovalState.NOT_APPROVED
	// 	//         : ApprovalState.APPROVED
	// 	// }, [amountToApprove, currentAllowance, pendingApproval, spender])

	// 	// const tokenContract = useTokenContract(token?.address)
	// 	// const addTransaction = useTransactionAdder()

	// 	// const approve = useCallback(async (): Promise<void> => {
	// 	//     if (approvalState !== ApprovalState.NOT_APPROVED) {
	// 	//         console.error('approve was called unnecessarily')
	// 	//         return
	// 	//     }
	// 	//     if (!token) {
	// 	//         console.error('no token')
	// 	//         return
	// 	//     }

	// 	//     if (!tokenContract) {
	// 	//         console.error('tokenContract is null')
	// 	//         return
	// 	//     }

	// 	//     if (!amountToApprove) {
	// 	//         console.error('missing amount to approve')
	// 	//         return
	// 	//     }

	// 	//     if (!spender) {
	// 	//         console.error('no spender')
	// 	//         return
	// 	//     }

	// 	//     let useExact = false
	// 	//     const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
	// 	//         // general fallback for tokens who restrict approval amounts
	// 	//         useExact = true
	// 	//         return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString())
	// 	//     })

	// 	//     return tokenContract
	// 	//         .approve(spender, useExact ? amountToApprove.raw.toString() : MaxUint256, {
	// 	//             gasLimit: calculateGasMargin(estimatedGas)
	// 	//         })
	// 	//         .then((response: TransactionResponse) => {
	// 	//             addTransaction(response, {
	// 	//                 summary: 'Approve ' + amountToApprove.currency.symbol,
	// 	//                 approval: { tokenAddress: token.address, spender: spender }
	// 	//             })
	// 	//         })
	// 	//         .catch((error: Error) => {
	// 	//             console.debug('Failed to approve token', error)
	// 	//             throw error
	// 	//         })
	// 	// }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction])

	// 	// return [approvalState, approve]
	// }

	// static async getParsedAmounts() {}

	static async approve(
		props: IPoolServicesApproveProps
	): Promise<{ spender: string } | undefined> {
		const { amountToApprove, approvalState } = props;

		const { chainId } = await WalletFramework.getConnectionInfo();

		const spender = chainId
			? ROUTER_ADDRESS[chainId as ChainId]
			: ROUTER_ADDRESS[ChainId.NEVM];

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
			});

			return {
				spender,
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
