import React, { useEffect, useMemo, useState } from "react";
import { useWallet, FarmServices, IStakeInfo } from "pegasys-services";
import { useTokens } from "hooks";
import { getTokenPairs } from "utils";
import { WrappedTokenInfo } from "types";
import { JSBI, Token, TokenAmount } from "@pollum-io/pegasys-sdk";
import FarmCard from "./FarmCard";

const FarmCards: React.FC<{ filter: string; sort: "apr" | "poolWeight" }> = ({
	filter,
	sort,
}) => {
	const { userTokensBalance } = useTokens();
	const { chainId, address } = useWallet();
	const [pairs, setPairs] = useState<IStakeInfo[]>([]);

	const pairsToRender = useMemo(() => {
		let anyOrderPairs = pairs;

		if (filter) {
			anyOrderPairs = pairs.filter(
				pair =>
					pair.tokenA.name?.toUpperCase().includes(filter.toUpperCase()) ||
					pair.tokenB.name?.toUpperCase().includes(filter.toUpperCase())
			);
		}

		let ordered;

		if (sort === "apr") {
			ordered = anyOrderPairs.sort((a, b) => {
				if (a.combinedApr > b.combinedApr) {
					return 1;
				}
				if (a.combinedApr < b.combinedApr) {
					return -1;
				}
				return 0;
			});
		}

		// console.log("ordered: ", ordered);
		else {
			ordered = anyOrderPairs.sort((a, b) => {
				if (
					JSBI.greaterThan(a.totalStakedAmount.raw, b.totalStakedAmount.raw)
				) {
					return 1;
				}
				if (
					JSBI.greaterThan(b.totalStakedAmount.raw, a.totalStakedAmount.raw)
				) {
					return -1;
				}
				return 0;
			});
		}

		return ordered ?? anyOrderPairs;
		// let sortField: "combinedApr" | "totalStakedAmount" = "combinedApr";

		// if (sort === "poolWeight") {
		// 	sortField = "totalStakedAmount";
		// }

		// const orderedPairs = anyOrderPairs.sort((a, b) => {
		// 	const a =
		// 		a[sortField] instanceof TokenAmount ? a[sortField].raw : a[sortField];

		// 	if (
		// 		JSBI.greaterThan(
		// 			a[sortField] instanceof TokenAmount ? a[sortField].raw : a[sortField],
		// 			b[sortField]
		// 		)
		// 	) {
		// 		return 1;
		// 	}
		// 	if (JSBI.greaterThan(b[sortField], a[sortField])) {
		// 		return -1;
		// 	}
		// 	return 0;
		// });

		// return orderedPairs;
	}, [filter, sort]);

	// to do approve => generico para pools e farm

	useEffect(() => {
		const getAvailablePair = async () => {
			console.log("userTokensBalance: ", userTokensBalance);
			const pairsTokens = getTokenPairs(chainId, userTokensBalance);

			console.log("pairsTokens: ", pairsTokens);

			const stakeInfos = await FarmServices.getStakeInfos(
				pairsTokens as [WrappedTokenInfo, Token][],
				address,
				chainId
			);

			console.log("stakeinfos: ", stakeInfos);

			setPairs(stakeInfos);
		};

		getAvailablePair();
	}, [userTokensBalance]);

	return (
		<>
			{pairsToRender.map((pair, index) => (
				<FarmCard key={`farmCard${index}`} stakeInfo={pair} />
			))}
		</>
	);
};

export default FarmCards;
