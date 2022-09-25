import { Button, Flex, Img, Text } from "@chakra-ui/react";
import { FunctionComponent, Dispatch, SetStateAction } from "react";
import { useModal, usePicasso } from "hooks";

interface IPoolCards {
	poolTokens?: [];
	poolOf?: string;
	poolLiquidity?: string;
	poolVolume?: string;
	poolApr?: string;
	poolShare?: string;
	setIsCreate: Dispatch<SetStateAction<boolean>>;
}

export const PoolCards: FunctionComponent<IPoolCards> = props => {
	const {
		poolTokens,
		poolOf,
		poolLiquidity,
		poolVolume,
		poolApr,
		poolShare,
		setIsCreate,
	} = props;
	const theme = usePicasso();
	const { onOpenRemoveLiquidity, onOpenAddLiquidity } = useModal();

	return (
		<Flex
			flexDirection="column"
			p="6"
			w="xs"
			borderRadius="xl"
			border="1px solid rgb(86,190,216, 0.4)"
			background={theme.bg.blackAlpha}
		>
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
					size="sm"
					border="1px solid"
					borderColor={theme.text.cyanPurple}
					borderRadius="67px"
					bgColor="transparent"
					color={theme.text.whitePurple}
					fontSize="sm"
					py={["0.2rem", "0.2rem", "1", "1"]}
					h="2.2rem"
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
					size="sm"
					borderRadius="67px"
					bgColor={theme.bg.blueNavyLightness}
					color={theme.text.cyan}
					fontSize="sm"
					py={["0.2rem", "0.2rem", "1", "1"]}
					h="2.2rem"
					fontWeight="semibold"
					onClick={() => {
						setIsCreate(false);
						onOpenAddLiquidity();
					}}
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
