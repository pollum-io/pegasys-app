import { Button, ButtonProps, Flex, Img, Text } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { useModal, usePicasso, useWallet } from "hooks";
import { AddLiquidityModal, RemoveLiquidity } from "components/Modals";

type IVoteCards = ButtonProps;

export const VoteCards: FunctionComponent<IVoteCards> = props => {
	const theme = usePicasso();
	const { isGovernance, setIsGovernance } = useWallet();

	return (
		<Flex flexDirection="column" w={["xs", "md", "2xl", "2xl"]}>
			<Flex
				w="100%"
				mb="2"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
			>
				<Flex
					w="100%"
					h="58px"
					bgColor={theme.bg.blackAlpha}
					borderRadius="xl"
					justifyContent="space-between"
					alignItems="center"
					_hover={{ cursor: "pointer" }}
					boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)"
					onClick={() => setIsGovernance(true)}
				>
					<Flex gap="3" alignItems="center">
						<Text color={theme.text.transactionsItems} pl="3">
							2.9
						</Text>
						<Text
							color={theme.text.mono}
							fontSize="14.5px"
							pr="2"
							pt="0.063rem"
						>
							Should the Pegasys community participate in the Protocol Guild
							Pilot?{" "}
						</Text>
					</Flex>
					<Flex
						borderRightRadius="xl"
						bgColor={theme.bg.farmRate}
						w="7.125rem"
						h="100%"
						justifyContent="center"
						flexDirection="column"
						_hover={{ cursor: "auto" }}
						onClick={() => setIsGovernance(false)}
					>
						<Text
							fontWeight="bold"
							color="#68D391"
							fontSize="0.813rem"
							pl="1.4rem"
						>
							EXECUTED
						</Text>
						<Text
							fontWeight="normal"
							color={theme.text.transactionsItems}
							fontSize="0.813rem"
							pl="1.1rem"
							mt="0.125"
						>
							04 Aug 2022
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};
