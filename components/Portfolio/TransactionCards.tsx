import { Flex, useColorMode, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { usePicasso } from "hooks";

interface ITransactionCards {
	type?: string;
	totalValue?: string;
	totalAmount?: string;
	tokenAmount?: string;
	time?: string;
}

export const TransactionCards: FunctionComponent<ITransactionCards> = props => {
	const {
		type = "Add USDT and BUSD",
		totalValue = "$0.0978",
		totalAmount = "0.04585 USDT",
		tokenAmount = "0.0003 BUSD",
		time = "4 days ago",
	} = props;

	const theme = usePicasso();
	const { colorMode } = useColorMode();

	return (
		<Flex
			justifyContent="center"
			w="100%"
			px={["1.5rem", "2rem", "2.5rem", "8rem"]}
		>
			<Flex
				w="100%"
				background={
					colorMode === "light"
						? `linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(350.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 100%) border-box`
						: theme.bg.blackAlpha
				}
				pl={["4", "4", "6", "6"]}
				py={["4", "3", "3", "3.5"]}
				border="1px solid transparent"
				borderRadius="0.75rem"
				mb="2"
			>
				<Flex
					flexDirection="row"
					alignItems="center"
					justifyContent="space-between"
					color={theme.text.mono}
					w={["96.5%", "98%", "96%", "96%"]}
				>
					<Flex gap="3" alignItems="center" w={["68%", "50%", "32%", "34.2%"]}>
						<Flex
							flexDirection={["column", "column", "row", "row"]}
							alignItems={["flex-start", "flex-start", "center", "center"]}
							justifyContent="space-between"
							w="100%"
						>
							<Text
								fontWeight="bold"
								fontSize="14px"
								color={theme.text.cyanPurple}
							>
								{type}
							</Text>
							<Flex display={["flex", "flex", "none", "none"]}>
								<Text fontSize="14px" fontStyle="italic">
									{time}
								</Text>
							</Flex>
						</Flex>
					</Flex>
					<Flex
						flexDirection={["column", "row", "row", "row"]}
						alignItems={["flex-end", "flex-start", "center", "center"]}
						w={["32%", "50%", "68%", "100%"]}
						justifyContent="space-between"
						h="100%"
					>
						<Flex
							flexDirection="column"
							display={["none", "flex", "none", "none"]}
						>
							<Text fontSize="14px">{totalAmount}</Text>
							<Text fontSize="14px">{tokenAmount}</Text>
						</Flex>
						<Text fontSize="14px" order={[0, 1, 0, 0]}>
							{totalValue}{" "}
						</Text>
						<Text
							order={[1, 0, 0, 0]}
							fontSize={["12px", "14px", "14px", "14px"]}
							display={["none", "none", "flex", "flex"]}
						>
							{totalAmount}
						</Text>
						<Text
							fontSize={["12px", "14px", "14px", "14px"]}
							display={["none", "none", "flex", "flex"]}
						>
							{tokenAmount}
						</Text>
						<Text fontSize="14" display={["none", "none", "flex", "flex"]}>
							{time}
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};
