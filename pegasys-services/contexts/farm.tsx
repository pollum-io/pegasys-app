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
} from "../dto";
import { EarnProvider } from "./earn";

export const FarmContext = createContext({} as IFarmProviderValue);

const Provider: React.FC<IFarmProviderProps> = ({ children }) => {
	const [sort, setSort] = useState<TFarmSort>("apr");
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
	} = useEarn();

	const withdraw = async () => {
		const typedValue = getTypedValue();

		if (selectedOpportunity && typedValue) {
			let method = FarmServices.withdraw;

			if (typedValue.isAllIn) {
				method = FarmServices.withdrawAndClaim;
			}

			await method(
				selectedOpportunity.poolId,
				typedValue.value.toString(16),
				address
			);
		}
	};

	const claim = async () => {
		if (selectedOpportunity) {
			await FarmServices.claim(selectedOpportunity.poolId, address);
		}
	};

	const deposit = async () => {
		const typedValue = getTypedValue(true);

		if (selectedOpportunity && typedValue && signature) {
			await FarmServices.deposit(
				selectedOpportunity.poolId,
				typedValue.value.toString(16),
				address,
				signature
			);
		}
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

	useEffect(() => {
		if (chainId && address) {
			const getAvailablePair = async () => {
				const pairsTokens = getTokenPairs(chainId, userTokensBalance);

				const stakeInfos = await FarmServices.getFarmInfos(
					pairsTokens as [WrappedTokenInfo, Token][],
					address,
					chainId,
					provider
				);

				setEarnOpportunities(stakeInfos);
			};

			getAvailablePair();
		}
	}, [userTokensBalance, chainId, address]);

	useEffect(() => {
		let pairsToRender: IEarnInfo[] = [];

		if (search) {
			earnOpportunities.forEach(p => {
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
			pairsToRender = [...earnOpportunities];
		}

		switch (sort) {
			case "poolWeight":
				pairsToRender = pairsToRender.sort((a, b) => {
					if (a.totalStakedInUsd > b.totalStakedInUsd) {
						return -1;
					}
					if (a.totalStakedInUsd < b.totalStakedInUsd) {
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
