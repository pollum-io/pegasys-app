import React, { useEffect, createContext, useState, useMemo } from "react";
import { JSBI, Token } from "@pollum-io/pegasys-sdk";

import { getTokenPairs } from "utils";
import { WrappedTokenInfo } from "types";
import { useTokens } from "hooks";

import { useTranslation } from "react-i18next";
import { ContractFramework, RoutesFramework } from "../frameworks";
import { FarmServices } from "../services";
import { useWallet, useEarn, useTransaction, useToasty } from "../hooks";
import {
	IFarmProviderProps,
	IFarmProviderValue,
	TFarmSort,
	IFarmInfo,
} from "../dto";
import { EarnProvider } from "./earn";

export const FarmContext = createContext({} as IFarmProviderValue);

const Provider: React.FC<IFarmProviderProps> = ({ children }) => {
	const [sort, setSort] = useState<TFarmSort>("yours");
	const [sortedPairs, setSortPairs] = useState<IFarmInfo[]>([]);
	const [search, setSearch] = useState<string>("");
	const { userTokensBalance } = useTokens();
	const { chainId, address, provider } = useWallet();
	const { t: translation } = useTranslation();
	const { pendingTxs } = useTransaction();
	const { toast } = useToasty();
	const {
		signature,
		onSign,
		getTypedValue,
		selectedOpportunity,
		setEarnOpportunities,
		earnOpportunities,
		withdrawPercentage,
		onContractCall,
		setDataLoading,
	} = useEarn();

	const farmContract = useMemo(
		() =>
			ContractFramework.FarmContract({
				chainId,
			}),
		[chainId]
	);

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

					const res = await method({
						poolId,
						amount: typedValue.value.toString(16),
						address,
						farmContract,
						chainId,
					});

					return res;
				}

				return undefined;
			},
			"Withdraw deposited liquidity",
			"withdraw-farm"
		);
	};

	const claim = async () => {
		await onContractCall(
			async () => {
				if (selectedOpportunity) {
					const { poolId } = selectedOpportunity as IFarmInfo;

					const res = await FarmServices.claim({
						poolId,
						address,
						farmContract,
						chainId,
					});

					return res;
				}

				return undefined;
			},
			"Claim accumulated PSYS rewards",
			"claim-farm"
		);
	};

	const deposit = async () => {
		await onContractCall(
			async () => {
				const typedValue = getTypedValue(true);

				if (selectedOpportunity && typedValue && signature) {
					const { poolId } = selectedOpportunity as IFarmInfo;

					const res = await FarmServices.deposit({
						poolId,
						amount: typedValue.value.toString(16),
						address,
						signatureData: signature,
						farmContract,
						chainId,
					});

					return res;
				}

				return undefined;
			},
			"Deposit liquidity",
			"deposit-farm"
		);
	};

	const sign = async () => {
		if (selectedOpportunity) {
			const contract = ContractFramework.PairContract({
				address: selectedOpportunity.stakeToken.address,
			});

			await onSign(
				contract,
				"Pegasys LP Token",
				RoutesFramework.getMinichefAddress(chainId),
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

	const getAvailablePair = async () => {
		try {
			setDataLoading(true);
			if (chainId && address && RoutesFramework.getMinichefAddress(chainId)) {
				const pairsTokens = getTokenPairs(chainId, userTokensBalance);

				const stakeInfos = await FarmServices.getFarmOpportunities({
					tokenPairs: pairsTokens as [WrappedTokenInfo, Token][],
					walletAddress: address,
					chainId,
					provider,
					farmContract,
				});

				setEarnOpportunities(stakeInfos);

				const sorted = onSort(stakeInfos);

				setSortPairs(sorted);
			}
		} catch (e) {
			toast({
				id: "toast",
				position: "top-right",
				status: "error",
				title: translation("toasts.errorFarm"),
			});
		} finally {
			setDataLoading(false);
		}
	};

	const farmPendingClaim = useMemo(() => {
		if (!chainId) return [];

		return [...pendingTxs.filter(tx => tx.service === "claim-farm")];
	}, [pendingTxs, chainId]);

	const farmPendingDeposit = useMemo(() => {
		if (!chainId) return [];

		return [...pendingTxs.filter(tx => tx.service === "deposit-farm")];
	}, [pendingTxs, chainId]);

	const farmPendingWithdraw = useMemo(() => {
		if (!chainId) return [];

		return [...pendingTxs.filter(tx => tx.service === "withdraw-farm")];
	}, [pendingTxs, chainId]);

	useEffect(() => {
		getAvailablePair();
	}, [
		userTokensBalance,
		chainId,
		address,
		farmPendingClaim.length,
		farmPendingDeposit.length,
		farmPendingWithdraw.length,
	]);

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

		setSortPairs([...pairsToRender]);
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
