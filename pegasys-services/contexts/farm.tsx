import React, { useEffect, createContext, useState, useMemo } from "react";
import { JSBI, Token, TokenAmount } from "@pollum-io/pegasys-sdk";

import { getTokenPairs, tryParseAmount } from "utils";
import { WrappedTokenInfo } from "types";
import { useTokens, useWallet } from "hooks";

import {
	BIG_INT_SECONDS_IN_WEEK,
	MINICHEF_ADDRESS,
} from "pegasys-services/constants";
import { FarmServices, LpTokenServices } from "../services";
import { useWallet as psUseWallet } from "../hooks";
import { onlyNumbers } from "../utils";
import {
	IFarmProviderProps,
	IFarmProviderValue,
	TFarmSort,
	IFarmInfo,
} from "../dto";

export const FarmContext = createContext({} as IFarmProviderValue);

export const FarmProvider: React.FC<IFarmProviderProps> = ({ children }) => {
	const [withdrawnTypedValue, setWithdrawnTypedValue] = useState<string>("");
	const [depositTypedValue, setDepositTypedValue] = useState<string>("");
	const [selectedPair, setSelectedPair] = useState<IFarmInfo>();
	const [allPairs, setAllPairs] = useState<IFarmInfo[]>([]);
	const [pairs, setPairs] = useState<IFarmInfo[]>([]);
	const [sort, setSort] = useState<TFarmSort>("apr");
	const [search, setSearch] = useState<string>("");
	const [buttonId, setButtonId] = useState<string>("");
	const { userTokensBalance } = useTokens();
	const { chainId, address } = psUseWallet();
	const { userTransactionDeadlineValue } = useWallet();

	const parsedStakeInput = useMemo(
		() =>
			selectedPair
				? tryParseAmount(depositTypedValue, selectedPair.lpToken)
				: undefined,
		[depositTypedValue]
	);

	const onWithdraw = async () => {
		if (selectedPair) {
			const parsedInput = tryParseAmount(
				withdrawnTypedValue,
				selectedPair.lpToken
			);

			const parsedAmount =
				parsedInput &&
				selectedPair.userStakedAmount &&
				JSBI.lessThanOrEqual(parsedInput.raw, selectedPair.userStakedAmount.raw)
					? parsedInput.raw
					: JSBI.BigInt(0);

			let method = FarmServices.withdraw;

			if (JSBI.equal(parsedAmount, selectedPair.userStakedAmount.raw)) {
				method = FarmServices.withdrawAndClaim;
			}

			await method(selectedPair.poolId, parsedAmount.toString(16), address);
		}
	};

	const onClaim = async () => {
		if (selectedPair) {
			await FarmServices.claim(selectedPair.poolId, address);
		}
	};

	const onDeposit = async () => {
		if (selectedPair) {
			const parsedAmount =
				parsedStakeInput &&
				selectedPair.userAvailableLpTokenAmount &&
				JSBI.lessThanOrEqual(
					parsedStakeInput.raw,
					selectedPair.userAvailableLpTokenAmount.raw
				)
					? parsedStakeInput.raw
					: JSBI.BigInt(0);

			const signature = await LpTokenServices.getSignature({
				lpAddress: selectedPair.lpToken.address,
				address,
				chainId,
				spender: MINICHEF_ADDRESS,
				value: parsedAmount.toString(),
				deadline: userTransactionDeadlineValue,
			});

			await FarmServices.deposit(
				selectedPair.poolId,
				parsedAmount.toString(16),
				address,
				signature
			);
		}
	};

	useEffect(() => {
		if (chainId && address) {
			const getAvailablePair = async () => {
				const pairsTokens = getTokenPairs(chainId, userTokensBalance);

				const stakeInfos = await FarmServices.getFarmInfos(
					pairsTokens as [WrappedTokenInfo, Token][],
					address,
					chainId
				);

				setAllPairs(stakeInfos);
			};

			getAvailablePair();
		}
	}, [userTokensBalance, chainId, address]);

	useEffect(() => {
		let pairsToRender: IFarmInfo[] = [];

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
				pairsToRender = pairsToRender.sort((a, b) => {
					if (
						// a.totalStakedInUsd > b.totalStakedInUsd
						JSBI.greaterThan(a.totalStakedAmount.raw, b.totalStakedAmount.raw)
					) {
						return -1;
					}
					// if (a.totalStakedInUsd < b.totalStakedInUsd) {
					if (JSBI.lessThan(a.totalStakedAmount.raw, b.totalStakedAmount.raw)) {
						return 1;
					}
					return 0;
				});
				break;
			default:
				pairsToRender = pairsToRender.sort((a, b) => {
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

	const liveRewardWeek = useMemo(
		() =>
			selectedPair
				? new TokenAmount(
						selectedPair.lpToken,
						parsedStakeInput &&
						JSBI.greaterThan(selectedPair.totalStakedAmount.raw, JSBI.BigInt(0))
							? JSBI.divide(
									JSBI.multiply(
										JSBI.multiply(
											selectedPair.poolRewardRateAmount.raw,
											parsedStakeInput.raw
										),
										BIG_INT_SECONDS_IN_WEEK
									),
									selectedPair.totalStakedAmount.raw
							  )
							: JSBI.BigInt(0)
				  )
				: undefined,
		[selectedPair, parsedStakeInput]
	);

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
				const newVal = onlyNumbers(value);
				setWithdrawnTypedValue(newVal);
			},
			depositTypedValue,
			setDepositTypedValue: (value: string) => {
				const newVal = onlyNumbers(value);
				setDepositTypedValue(newVal);
			},
			onClaim,
			onWithdraw,
			onDeposit,
			liveRewardWeek,
			buttonId,
			setButtonId,
		}),
		[
			sort,
			search,
			pairs,
			selectedPair,
			withdrawnTypedValue,
			depositTypedValue,
			buttonId,
		]
	);

	return (
		<FarmContext.Provider value={providerValue}>
			{children}
		</FarmContext.Provider>
	);
};
