import React, { useEffect, createContext, useState, useMemo } from "react";
import { JSBI, Token } from "@pollum-io/pegasys-sdk";

import { getTokenPairs } from "utils";
import { WrappedTokenInfo } from "types";
import { useTokens, useWallet } from "hooks";

import { MINICHEF_ADDRESS } from "pegasys-services/constants";
import { ContractFramework } from "pegasys-services/frameworks";
import { FarmServices } from "../services";
import { useWallet as psUseWallet, useEarn } from "../hooks";
import {
	IFarmProviderProps,
	IFarmProviderValue,
	TFarmSort,
	IEarnInfo,
	IFarmInfo,
} from "../dto";
import { EarnProvider } from "./earn";

export const FarmContext = createContext({} as IFarmProviderValue);

const Provider: React.FC<IFarmProviderProps> = ({ children }) => {
	const [sort, setSort] = useState<TFarmSort>("yours");
	const [sortedPairs, setSortPairs] = useState<IEarnInfo[]>([]);
	const [search, setSearch] = useState<string>("");
	const { userTokensBalance } = useTokens();
	const { chainId, address } = psUseWallet();
	const { provider } = useWallet();
	const {
		signature,
		onSign,
		getTypedValue,
		selectedOpportunity,
		setEarnOpportunities,
		earnOpportunities,
		withdrawPercentage,
		onContractCall,
	} = useEarn();

	const withdraw = async () => {
		await onContractCall(
			async () => {
				const typedValue = getTypedValue();

				if (selectedOpportunity && typedValue) {
					let method = FarmServices.withdraw;
					const { poolId } = selectedOpportunity as IFarmInfo;

					if (withdrawPercentage === 100) {
						method = FarmServices.withdrawAndClaim;
					}

					const res = await method(
						poolId,
						typedValue.value.toString(16),
						address
					);

					return res;
				}

				return undefined;
			},
			"Withdraw deposited liquidity",
			"withdraw"
		);
	};

	const claim = async () => {
		await onContractCall(
			async () => {
				if (selectedOpportunity) {
					const { poolId } = selectedOpportunity as IFarmInfo;

					const res = await FarmServices.claim(poolId, address);

					return res;
				}

				return undefined;
			},
			"Claim accumulated PSYS rewards",
			"claim"
		);
	};

	const deposit = async () => {
		await onContractCall(
			async () => {
				const typedValue = getTypedValue(true);

				if (selectedOpportunity && typedValue && signature) {
					const { poolId } = selectedOpportunity as IFarmInfo;

					const res = await FarmServices.deposit(
						poolId,
						typedValue.value.toString(16),
						address,
						signature
					);

					return res;
				}

				return undefined;
			},
			"Deposit liquidity",
			"deposit"
		);
	};

	const sign = async () => {
		if (selectedOpportunity) {
			const contract = ContractFramework.PairContract(
				selectedOpportunity.stakeToken.address
			);

			await onSign(
				contract,
				"Pegasys LP Token",
				MINICHEF_ADDRESS,
				selectedOpportunity.stakeToken.address,
				"1"
			);
		}
	};

	const onSort = (pairs: IFarmInfo[]) => {
		let pairsToRender = [];

		switch (sort) {
			case "liquidity":
				pairsToRender = pairs.sort((a, b) => {
					if (a.totalStakedInUsd > b.totalStakedInUsd) {
						return -1;
					}
					if (a.totalStakedInUsd < b.totalStakedInUsd) {
						return 1;
					}
					return 0;
				});
				break;
			case "apr":
				pairsToRender = pairs.sort((a, b) => {
					if (a.combinedApr > b.combinedApr) {
						return -1;
					}
					if (a.combinedApr < b.combinedApr) {
						return 1;
					}
					return 0;
				});
				break;
			default:
				pairsToRender = pairs.sort((a, b) => {
					if (JSBI.greaterThan(a.stakedAmount.raw, b.stakedAmount.raw)) {
						return -1;
					}
					if (JSBI.greaterThan(b.stakedAmount.raw, a.stakedAmount.raw)) {
						return 1;
					}
					return 0;
				});
				break;
		}

		return pairsToRender;
	};

	useEffect(() => {
		if (chainId && address) {
			const getAvailablePair = async () => {
				const pairsTokens = getTokenPairs(chainId, userTokensBalance);

				const stakeInfos = await FarmServices.getFarmOpportunities(
					pairsTokens as [WrappedTokenInfo, Token][],
					address,
					chainId,
					provider
				);

				setEarnOpportunities(stakeInfos);

				const sorted = onSort(stakeInfos);

				setSortPairs(sorted);
			};

			getAvailablePair();
		}
	}, [userTokensBalance, chainId, address]);

	useEffect(() => {
		let pairsToRender: IFarmInfo[] = [];

		if (search) {
			earnOpportunities.forEach(p => {
				const tokenAName = p.tokenA.name?.toLowerCase() ?? "";
				const tokenASymbol = p.tokenA.symbol?.toLowerCase() ?? "";
				const tokenBName = p.tokenB?.name?.toLowerCase() ?? "";
				const tokenBSymbol = p.tokenB?.symbol?.toLowerCase() ?? "";

				const lowerCaseSearch = search.toLowerCase();

				if (
					tokenAName.includes(lowerCaseSearch) ||
					tokenBName.includes(lowerCaseSearch) ||
					tokenASymbol.includes(lowerCaseSearch) ||
					tokenBSymbol.includes(lowerCaseSearch)
				) {
					pairsToRender.push(p as IFarmInfo);
				}
			});
		} else {
			pairsToRender = earnOpportunities as IFarmInfo[];
		}

		pairsToRender = onSort(pairsToRender);

		setSortPairs(pairsToRender);
	}, [earnOpportunities, sort, search]);

	const providerValue = useMemo(
		() => ({
			sort,
			setSort,
			search,
			setSearch,
			sortedPairs,
			claim,
			sign,
			deposit,
			withdraw,
		}),
		[
			sort,
			setSort,
			search,
			setSearch,
			sortedPairs,
			setSortPairs,
			sign,
			claim,
			deposit,
			withdraw,
		]
	);

	return (
		<FarmContext.Provider value={providerValue}>
			{children}
		</FarmContext.Provider>
	);
};

export const FarmProvider: React.FC<IFarmProviderProps> = ({ children }) => (
	<EarnProvider>
		<Provider>{children}</Provider>
	</EarnProvider>
);
