import React, { useEffect, createContext, useState, useMemo } from "react";
import { JSBI, NSYS, Token, TokenAmount } from "@pollum-io/pegasys-sdk";

import { getTokenPairs, tryParseAmount } from "utils";
import { WrappedTokenInfo } from "types";
import { useTokens, useWallet } from "hooks";

import { MINICHEF_ADDRESS } from "pegasys-services/constants";
import { ApprovalState } from "contexts";
import { ContractFramework } from "pegasys-services/frameworks";
import { FarmServices, LpTokenServices, TokenServices } from "../services";
import { useWallet as psUseWallet } from "../hooks";
import {
	IFarmProviderProps,
	IFarmProviderValue,
	TFarmSort,
	IStakeInfo,
} from "../dto";

export const FarmContext = createContext({} as IFarmProviderValue);

export const FarmProvider: React.FC<IFarmProviderProps> = ({ children }) => {
	const [withdrawnTypedValue, setWithdrawnTypedValue] = useState<string>("0");
	const [depositTypedValue, setDepositTypedValue] = useState<string>("0");
	const [selectedPair, setSelectedPair] = useState<IStakeInfo>();
	const [allPairs, setAllPairs] = useState<IStakeInfo[]>([]);
	const [pairs, setPairs] = useState<IStakeInfo[]>([]);
	const [sort, setSort] = useState<TFarmSort>("apr");
	const [search, setSearch] = useState<string>("");
	const { userTokensBalance } = useTokens();
	const { chainId, address } = psUseWallet();
	const { userTransactionDeadlineValue } = useWallet();

	const onlyNumbersTyped = (str: string): string => {
		if (selectedPair) {
			const onlyNumbers = str.replace(/\D/g, "");
			// const onlyNumbers = str.replace(/[^\d.]+/g, "");

			const tokenAmount = new TokenAmount(
				selectedPair.lpToken,
				JSBI.BigInt(`${onlyNumbers}00000000`)
			);

			const amount = tokenAmount.toFixed(10, {
				groupSeparator: ",",
			});

			return amount;
		}

		return "0.0000000000";
	};

	const onWithdraw = async () => {
		if (selectedPair) {
			const parsedInput = tryParseAmount(
				withdrawnTypedValue,
				selectedPair.lpToken
			);

			const parsedAmount =
				parsedInput &&
				selectedPair.stakedAmount &&
				JSBI.lessThanOrEqual(parsedInput.raw, selectedPair.stakedAmount.raw)
					? parsedInput.raw
					: JSBI.BigInt(0);

			await FarmServices.withdraw(
				selectedPair.poolId,
				parsedAmount.toString(16),
				address
			);
		}
	};

	const onClaim = async () => {
		if (selectedPair) {
			await FarmServices.claim(selectedPair.poolId, address);
		}
	};

	const onDeposit = async () => {
		if (selectedPair) {
			const parsedInput = tryParseAmount(
				depositTypedValue,
				selectedPair.lpToken
			);

			const parsedAmount =
				parsedInput &&
				selectedPair.availableLpTokens &&
				JSBI.lessThanOrEqual(
					parsedInput.raw,
					selectedPair.availableLpTokens.raw
				)
					? parsedInput.raw
					: JSBI.BigInt(0);

			const token =
				parsedInput instanceof TokenAmount ? parsedInput.token : undefined;

			const contract = ContractFramework.TokenContract(token?.address ?? "");

			const allowance = await ContractFramework.call({
				contract,
				methodName: "allowance",
				args: [address, MINICHEF_ADDRESS],
			});

			const currentAllowance = new TokenAmount(token, allowance);

			let approvalState: ApprovalState;

			const pendingApproval = false;

			if (!parsedInput || !currentAllowance) {
				approvalState = ApprovalState.UNKNOWN;
			} else if (parsedInput.currency === NSYS) {
				approvalState = ApprovalState.APPROVED;
			} else {
				approvalState = currentAllowance.lessThan(parsedAmount)
					? pendingApproval
						? ApprovalState.PENDING
						: ApprovalState.NOT_APPROVED
					: ApprovalState.APPROVED;
			}

			if (approvalState === ApprovalState.APPROVED) {
				await FarmServices.deposit(
					selectedPair.poolId,
					parsedAmount.toString(16),
					address
				);
			} else {
				if (approvalState === ApprovalState.NOT_APPROVED) {
					await TokenServices.approve(
						parsedInput as TokenAmount,
						MINICHEF_ADDRESS
					);
				}

				const signature = await LpTokenServices.getSignature({
					lpAddress: selectedPair.lpToken.address,
					address,
					chainId,
					spender: MINICHEF_ADDRESS,
					value: parsedAmount.toString(),
					deadline: userTransactionDeadlineValue,
				});

				if (signature) {
					await FarmServices.depositWithPermit(
						selectedPair.poolId,
						parsedAmount.toString(16),
						address,
						signature
					);
				}
			}
		}
	};

	useEffect(() => {
		const getAvailablePair = async () => {
			const pairsTokens = getTokenPairs(chainId, userTokensBalance);

			const stakeInfos = await FarmServices.getStakeInfos(
				pairsTokens as [WrappedTokenInfo, Token][],
				address,
				chainId
			);

			setAllPairs(stakeInfos);
		};

		getAvailablePair();
	}, [userTokensBalance]);

	useEffect(() => {
		let pairsToRender: IStakeInfo[] = [];

		if (search) {
			allPairs.forEach(p => {
				const tokenAName = p.tokenA.name?.toLowerCase() ?? "";
				const tokenASymbol = p.tokenA.symbol?.toLowerCase() ?? "";
				const tokenBName = p.tokenB.name?.toLowerCase() ?? "";
				const tokenBSymbol = p.tokenB.symbol?.toLowerCase() ?? "";

				const lowerCaseSearch = search.toLowerCase();

				if (
					tokenAName.includes(lowerCaseSearch) ||
					tokenBName.includes(lowerCaseSearch) ||
					tokenASymbol.includes(lowerCaseSearch) ||
					tokenBSymbol.includes(lowerCaseSearch)
				) {
					pairsToRender.push(p);
				}
			});
		} else {
			pairsToRender = [...allPairs];
		}

		switch (sort) {
			case "poolWeight":
				pairsToRender.sort((a, b) => {
					if (
						JSBI.greaterThan(a.totalStakedAmount.raw, b.totalStakedAmount.raw)
					) {
						return -1;
					}
					if (JSBI.lessThan(a.totalStakedAmount.raw, b.totalStakedAmount.raw)) {
						return 1;
					}
					return 0;
				});
				break;
			default:
				pairsToRender.sort((a, b) => {
					if (a.combinedApr > b.combinedApr) {
						return -1;
					}
					if (a.swapFeeApr < b.swapFeeApr) {
						return 1;
					}
					return 0;
				});
				break;
		}

		setPairs(pairsToRender);
	}, [allPairs, sort, search]);

	const providerValue = useMemo(
		() => ({
			sort,
			setSort,
			search,
			setSearch,
			pairs,
			selectedPair,
			setSelectedPair,
			withdrawnTypedValue,
			setWithdrawnTypedValue: (value: string) => {
				const onlyNum = onlyNumbersTyped(value);

				setWithdrawnTypedValue(onlyNum);
			},
			depositTypedValue,
			setDepositTypedValue: (value: string) => {
				const onlyNum = onlyNumbersTyped(value);

				setDepositTypedValue(onlyNum);
			},
			onClaim,
			onWithdraw,
			onDeposit,
		}),
		[sort, search, pairs, selectedPair, withdrawnTypedValue, depositTypedValue]
	);

	return (
		<FarmContext.Provider value={providerValue}>
			{children}
		</FarmContext.Provider>
	);
};
