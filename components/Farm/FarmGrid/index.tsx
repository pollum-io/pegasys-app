import React, { useMemo, useState } from "react";
import { Flex } from "@chakra-ui/react";

import { IFarmInfo, useFarm } from "pegasys-services";
import { AddLiquidityModal } from "components/Modals";
import { useModal } from "hooks";
import { Pair, Token, TokenAmount } from "@pollum-io/pegasys-sdk";
import { WrappedTokenInfo } from "types";
import FarmCard from "../FarmCard";

const FarmGrid: React.FC = () => {
	const { sortedPairs } = useFarm();
	const [currPair, setCurrPair] = useState<Pair>();
	const [selectedToken, setSelectedToken] = useState<WrappedTokenInfo[]>([]);

	const {
		isOpenAddLiquidity,
		onCloseAddLiquidity,
		onOpenTransaction,
		onCloseTransaction,
	} = useModal();

	const [even, odds] = useMemo(() => {
		const oddIndexes: IFarmInfo[] = [];
		const evenIndexes: IFarmInfo[] = [];

		sortedPairs.forEach((p, i) => {
			if (i % 2 === 0) {
				evenIndexes.push(p as IFarmInfo);
			} else {
				oddIndexes.push(p as IFarmInfo);
			}
		});

		return [evenIndexes, oddIndexes];
	}, [sortedPairs]);

	return (
		<>
			<Flex
				w="100%"
				maxW="900px"
				zIndex="1"
				mt={["10", "10", "0", "0"]}
				mb="10rem"
				display={["none", "none", "flex", "flex"]}
				gap="30px"
				justifyContent="space-between"
			>
				{currPair && (
					<AddLiquidityModal
						isModalOpen={isOpenAddLiquidity}
						onModalClose={onCloseAddLiquidity}
						setSelectedToken={setSelectedToken}
						selectedToken={selectedToken}
						depositedTokens={{
							token0: new TokenAmount(currPair?.token0 as Token, "0"),
							token1: new TokenAmount(currPair?.token1 as Token, "0"),
						}}
						poolPercentShare="0.00"
						userPoolBalance="0"
						currPair={currPair}
						openPendingTx={onOpenTransaction}
						closePendingTx={onCloseTransaction}
					/>
				)}
				<Flex flexDirection="column" gap="2px" width="fit-content">
					{even.map(p => (
						<FarmCard
							key={p.poolId}
							stakeInfo={p}
							setCurrPair={setCurrPair}
							setSelectedToken={setSelectedToken}
						/>
					))}
				</Flex>
				<Flex flexDirection="column" gap="2px" width="fit-content">
					{odds.map(p => (
						<FarmCard
							key={p.poolId}
							stakeInfo={p}
							setCurrPair={setCurrPair}
							setSelectedToken={setSelectedToken}
						/>
					))}
				</Flex>
			</Flex>
			<Flex
				w="100%"
				maxW="900px"
				zIndex="1"
				mt={["10", "10", "0", "0"]}
				mb="10rem"
				display={["flex", "flex", "none", "none"]}
				gap="4px"
				flexDirection="column"
			>
				{sortedPairs.map(p => (
					<FarmCard
						key={p.poolId}
						stakeInfo={p}
						setCurrPair={setCurrPair}
						setSelectedToken={setSelectedToken}
					/>
				))}
			</Flex>
		</>
	);
};

export default FarmGrid;
