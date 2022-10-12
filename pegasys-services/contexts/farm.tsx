import React, { useEffect, createContext, useState, useMemo } from "react";
import { JSBI, Token } from "@pollum-io/pegasys-sdk";

import { addTransaction, getTokenPairs } from "utils";
import { WrappedTokenInfo } from "types";
import { ApprovalState, useTokens, useWallet } from "hooks";

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
	const [sort, setSort] = useState<TFarmSort>("apr");
	const [sortedPairs, setSortPairs] = useState<IEarnInfo[]>([]);
	const [search, setSearch] = useState<string>("");
	const { userTokensBalance } = useTokens();
	const { chainId, address } = psUseWallet();
	const {
		provider,
		setTransactions,
		transactions,
		setCurrentTxHash,
		setApprovalState,
	} = useWallet();
	const {
		signature,
		onSign,
		getTypedValue,
		selectedOpportunity,
		setEarnOpportunities,
		earnOpportunities,
	} = useEarn();

	const walletInfo = {
		walletAddress: address,
		chainId,
		provider,
	};

	const withdraw = async () => {
		const typedValue = getTypedValue();

		if (selectedOpportunity && typedValue) {
			let method = FarmServices.withdraw;
			const { poolId } = selectedOpportunity as IFarmInfo;

			if (typedValue.isAllIn) {
				method = FarmServices.withdrawAndClaim;
			}

			const { response, hash } = await method(
				poolId,
				typedValue.value.toString(16),
				address
			);

			// addTransaction(response, walletInfo, setTransactions, transactions, {
			// 	summary: "Withdraw deposited liquidity",
			// 	finished: false,
			// });
			// setCurrentTxHash(hash);
			// setApprovalState({ type: "withdraw", status: ApprovalState.PENDING });
		}
	};

	const claim = async () => {
		if (selectedOpportunity) {
			const { poolId } = selectedOpportunity as IFarmInfo;

			await FarmServices.claim(poolId, address);

			// addTransaction(response, walletInfo, setTransactions, transactions, {
			// 	summary: "Claim accumulated PSYS rewards",
			// 	finished: false,
			// });
			// setCurrentTxHash(hash);
			// setApprovalState({ type: "claim", status: ApprovalState.PENDING });
		}
	};

	const deposit = async () => {
		const typedValue = getTypedValue(true);

		if (selectedOpportunity && typedValue && signature) {
			const { poolId } = selectedOpportunity as IFarmInfo;

			await FarmServices.deposit(
				poolId,
				typedValue.value.toString(16),
				address,
				signature
			);

			// .then(({ response, hash }) => {
			// 	addTransaction(response, walletInfo, setTransactions, transactions, {
			// 		summary: "Deposit liquidity",
			// 		finished: false,
			// 	});
			// 	setCurrentTxHash(hash);
			// 	setApprovalState({ type: "deposit", status: ApprovalState.PENDING });
			// });
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

				const stakeInfos = await FarmServices.getFarmOpportunities(
					pairsTokens as [WrappedTokenInfo, Token][],
					address,
					chainId,
					provider
				);

				setEarnOpportunities(stakeInfos);
				setSortPairs(stakeInfos);
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
