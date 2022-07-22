import { Button, Flex, Img, Text, useDisclosure } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { usePicasso } from "hooks";
import { AddLiquidityModal, RemoveLiquidity } from "components/Modals";

interface IPoolCards {
	poolTokens?: [];
	poolOf?: string;
	poolLiquidity?: string;
	poolVolume?: string;
	poolApr?: string;
	poolShare?: string;
}

export const PoolCards: FunctionComponent<IPoolCards> = props => {
	const { poolOf, poolLiquidity, poolVolume, poolApr, poolShare, poolTokens } =
		props;
	const theme = usePicasso();
	const { onOpen, isOpen, onClose } = useDisclosure();
	const {
		onOpen: onOpenAdd,
		isOpen: isOpenAdd,
		onClose: onCloseAdd,
	} = useDisclosure();

	return (
		<Flex
			flexDirection="column"
			bgColor={theme.bg.blueNavy}
			p="6"
			w="xs"
			borderRadius="xl"
			border="1px solid transparent;"
			background={`linear-gradient(${theme.bg.blueNavy}, ${theme.bg.blueNavy}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
		>
			<RemoveLiquidity isModalOpen={isOpen} onModalClose={onClose} />
			<AddLiquidityModal isModalOpen={isOpenAdd} onModalClose={onCloseAdd} />
			<Flex gap="2">
				<Flex>
					<Img src="icons/syscoin-logo.png" w="6" h="6" />
					<Img src="icons/pegasys.png" w="6" h="6" />
				</Flex>
				<Text fontSize="lg" fontWeight="bold">
					{poolOf}
				</Text>
			</Flex>
			<Flex flexDirection="column" pt="6">
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold">Liquidity</Text>
					<Text>{poolLiquidity}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold">Volume</Text>
					<Text>{poolVolume}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold">APR</Text>
					<Text>{poolApr}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold">Your pool share</Text>
					<Text>{poolShare || "-"}</Text>
				</Flex>
			</Flex>
			<Flex gap="2" mt="1.5rem">
				<Button
					w="100%"
					py="2"
					px="6"
					border="1px solid"
					borderColor={theme.text.cyan}
					borderRadius="67px"
					bgColor="transparent"
					color={theme.text.mono}
					fontSize="sm"
					fontWeight="semibold"
					onClick={onOpen}
				>
					Remove
				</Button>
				<Button
					w="100%"
					py="2"
					px="6"
					borderRadius="67px"
					bgColor={theme.bg.button.connectWalletSwap}
					color={theme.text.cyan}
					fontSize="sm"
					fontWeight="semibold"
					onClick={onOpenAdd}
				>
					Add Liquidity
				</Button>
			</Flex>
		</Flex>
	);
};
