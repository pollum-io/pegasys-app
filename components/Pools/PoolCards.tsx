import { Button, Flex, Img, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { useModal, usePicasso } from "hooks";
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
	const {
		onOpenRemoveLiquidity,
		isOpenRemoveLiquidity,
		onCloseRemoveLiquidity,
		onOpenAddLiquidity,
		isOpenAddLiquidity,
		onCloseAddLiquidity,
	} = useModal();

	return (
		<Flex
			flexDirection="column"
			p="6"
			w="xs"
			borderRadius="xl"
			border="1px solid rgb(86,190,216, 0.4)"
			background={theme.bg.blackAlpha}
		>
			<RemoveLiquidity
				isModalOpen={isOpenRemoveLiquidity}
				onModalClose={onCloseRemoveLiquidity}
			/>
			<AddLiquidityModal
				isModalOpen={isOpenAddLiquidity}
				onModalClose={onCloseAddLiquidity}
			/>
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
					<Text fontWeight="semibold" color={theme.text.mono}>
						Liquidity
					</Text>
					<Text>{poolLiquidity}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold" color={theme.text.mono}>
						Volume
					</Text>
					<Text>{poolVolume}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold" color={theme.text.mono}>
						APR
					</Text>
					<Text>{poolApr}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold" color={theme.text.mono}>
						Your pool share
					</Text>
					<Text>{poolShare || "-"}</Text>
				</Flex>
			</Flex>
			<Flex gap="2" mt="1.5rem">
				<Button
					w="100%"
					py="2"
					px="6"
					border="1px solid"
					borderColor={theme.text.cyanPurple}
					borderRadius="67px"
					bgColor="transparent"
					color={theme.text.whitePurple}
					fontSize="sm"
					fontWeight="semibold"
					onClick={onOpenRemoveLiquidity}
					_hover={{
						borderColor: theme.text.cyanLightPurple,
						color: theme.text.cyanLightPurple,
					}}
				>
					Remove
				</Button>
				<Button
					w="100%"
					py="2"
					px="6"
					borderRadius="67px"
					bgColor={theme.bg.blueNavyLightness}
					color={theme.text.cyan}
					fontSize="sm"
					fontWeight="semibold"
					onClick={onOpenAddLiquidity}
					_hover={{
						bgColor: theme.bg.bluePurple,
					}}
				>
					Add Liquidity
				</Button>
			</Flex>
		</Flex>
	);
};
