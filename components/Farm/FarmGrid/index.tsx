import React, { useMemo } from "react";
import { Flex } from "@chakra-ui/react";

import { IFarmInfo, useFarm } from "pegasys-services";
import FarmCard from "../FarmCard";

const FarmGrid: React.FC = () => {
	const { sortedPairs } = useFarm();

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
				<Flex flexDirection="column" gap="2px" width="fit-content">
					{even.map(p => (
						<FarmCard key={p.poolId} stakeInfo={p} />
					))}
				</Flex>
				<Flex flexDirection="column" gap="2px" width="fit-content">
					{odds.map(p => (
						<FarmCard key={p.poolId} stakeInfo={p} />
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
					<FarmCard key={p.poolId} stakeInfo={p} />
				))}
			</Flex>
		</>
	);
};

export default FarmGrid;
