import { Flex, useColorMode, Text, Image } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { usePicasso } from "hooks";

interface IWalletStatsCards {
	asset?: string;
	icon?: string;
	price?: string;
	balance?: string;
	value?: string;
}

export const WalletStatsCards: FunctionComponent<IWalletStatsCards> = props => {
	const {
		asset = "SYS",
		icon = "icons/syscoin-logo.png",
		price = "$1,043.27",
		balance = "0.0000554448",
		value = "$0.06",
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
				pl="6"
				py={["4", "3", "3", "3"]}
				border="1px solid transparent"
				borderRadius="0.75rem"
				mb="2"
			>
				<Flex
					flexDirection="row"
					alignItems="center"
					justifyContent="space-between"
					color={theme.text.mono}
					w="90%"
				>
					<Flex gap="3" alignItems="center" w={["45%", "45%", "41%", "34.2%"]}>
						<Image src={icon} h="10" w="10" />
						<Flex
							flexDirection={["column", "row", "row", "row"]}
							alignItems={["flex-start", "center", "center", "center"]}
							justifyContent="space-between"
							w="100%"
						>
							<Text fontWeight="bold" fontSize="14px">
								{asset}
							</Text>
							<Text fontSize={["12px", "14px", "14px", "14px"]}>{price}</Text>
						</Flex>
					</Flex>
					<Flex
						flexDirection={["column", "row", "row", "row"]}
						alignItems={["flex-start", "center", "center", "center"]}
						w={["45%", "42%", "45%", "43.2%"]}
						justifyContent="space-between"
						h="100%"
					>
						<Text
							order={[1, 0, 0, 0]}
							fontSize={["12px", "14px", "14px", "14px"]}
						>
							{balance}
						</Text>
						<Text fontSize="14">{value}</Text>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};
