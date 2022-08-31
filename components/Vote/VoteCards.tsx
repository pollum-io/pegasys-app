import { Button, ButtonProps, Flex, Img, Text } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { useModal, usePicasso, useWallet } from "hooks";
import { AddLiquidityModal, RemoveLiquidity } from "components/Modals";

type IVoteCards = ButtonProps;

export const VoteCards: FunctionComponent<IVoteCards> = props => {
	const theme = usePicasso();
	const { isGovernance, setIsGovernance } = useWallet();

	return (
		<Flex
			w={["xs", "md", "2xl", "2xl"]}
			mb="2"
			alignItems="center"
			justifyContent="center"
		>
			<Flex
				flexDirection={["column", "column", "row", "row"]}
				w="100%"
				h={["100px", "100px", "58px", "58px"]}
				bgColor={theme.bg.blueNavyLight}
				borderRadius="xl"
				justifyContent="space-between"
				alignItems="center"
				_hover={{ cursor: "pointer" }}
				boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)"
				onClick={() => setIsGovernance(true)}
			>
				<Flex
					gap="3"
					alignItems={["flex-start", "flex-start", "flex-start", "flex-start"]}
					py={["3", "3", "1", "1"]}
				>
					<Text color={theme.text.transactionsItems} pl="3">
						2.9
					</Text>
					<Text
						color={theme.text.mono}
						fontSize={["14.5px", "14.5px", "14.5px", "14.5px"]}
						pr={["2", "2", "0", "0"]}
						pt={["0.5", "0.5", "0.5", "0.5"]}
					>
						Should the Pegasys community participate in the Protocol Guild
						Pilot?{" "}
					</Text>
				</Flex>
				<Flex
					borderBottomRadius={["xl", "xl", "0", "0"]}
					borderRightRadius={["0", "0", "xl", "xl"]}
					borderBottomRightRadius={["xl", "xl", "xl", "xl"]}
					zIndex="99"
					bgColor={theme.bg.farmRate}
					w={["100%", "100%", "7.125rem", "7.125rem"]}
					h={["25%", "25%", "100%", "100%"]}
					justifyContent={["center", "center", "center", "center"]}
					flexDirection={["row", "row", "column", "column"]}
					_hover={{ cursor: "auto" }}
					onClick={() => setIsGovernance(false)}
					alignItems={["center", "center", "center", "center"]}
					py={["0.5rem", "0", "0", "0"]}
					px={["0.9rem", "0.9rem", "1rem", "1rem"]}
					gap={["3", "3", "0", "0"]}
				>
					<Text
						fontWeight="bold"
						color="#68D391"
						fontSize={["0.75rem", "0.813rem", "0.813rem", "0.813rem"]}
					>
						EXECUTED
					</Text>
					<Text
						fontWeight="normal"
						color={theme.text.transactionsItems}
						fontSize={["0.7rem", "0.813rem", "0.813rem", "0.813rem"]}
						mt="0.125"
					>
						04 Aug 2022
					</Text>
				</Flex>
			</Flex>
		</Flex>
	);
};
