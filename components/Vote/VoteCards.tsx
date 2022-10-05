import { ButtonProps, Flex, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { usePicasso, useWallet } from "hooks";

interface IVoteCards {
	title?: string;
	status?: string;
	date?: string;
	version?: string;
}

export const VoteCards: FunctionComponent<IVoteCards> = props => {
	const {
		title = "Should the Pegasys community participate in the Protocol Guild Pilot?",
		status = "executed",
		date = "04 Aug 2022",
		version = "2.9",
	} = props;
	const theme = usePicasso();
	const { setIsGovernance, showCancelled } = useWallet();

	return (
		<Flex
			w={["xs", "md", "2xl", "2xl"]}
			mb="2"
			alignItems="center"
			justifyContent="center"
		>
			<Flex
				visibility={
					showCancelled && status === "defeated" ? "hidden" : "visible"
				}
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
					<Text
						color={theme.text.softGray}
						pl="3"
						fontSize={["14.5px", "14.5px", "14.5px", "14.5px"]}
					>
						{version}
					</Text>
					<Text
						color={theme.text.mono}
						fontSize={["14.5px", "14.5px", "14.5px", "14.5px"]}
						pr={["2", "2", "0", "0"]}
					>
						{title}{" "}
					</Text>
				</Flex>
				<Flex
					borderBottomRadius={["xl", "xl", "0", "0"]}
					borderRightRadius={["0", "0", "xl", "xl"]}
					borderBottomRightRadius={["xl", "xl", "xl", "xl"]}
					zIndex="99"
					bgColor={theme.bg.neutralGray}
					w={["100%", "100%", "7.125rem", "7.125rem"]}
					h={["25%", "25%", "100%", "100%"]}
					justifyContent={["center", "center", "center", "center"]}
					flexDirection={["row", "row", "column", "column"]}
					_hover={{ cursor: "auto" }}
					onClick={() => setIsGovernance(false)}
					alignItems={["center", "center", "center", "center"]}
					py={["1", "0", "0", "0"]}
					px={["0.9rem", "0.9rem", "1rem", "1rem"]}
					gap={["3", "3", "0", "0"]}
				>
					<Text
						fontWeight="bold"
						color={status === "executed" ? "#68D391" : "#FC8181"}
						fontSize={["0.75rem", "0.813rem", "0.813rem", "0.813rem"]}
						textTransform="uppercase"
					>
						{status}
					</Text>

					<Text
						fontWeight="normal"
						color={theme.text.softGray}
						fontSize={["0.75rem", "0.813rem", "0.813rem", "0.813rem"]}
					>
						{date}
					</Text>
				</Flex>
			</Flex>
		</Flex>
	);
};
