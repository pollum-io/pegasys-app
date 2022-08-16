import { Button, Flex, Grid, GridItem, Img, Text } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { useModal, usePicasso } from "hooks";
import { AddLiquidityModal, RemoveLiquidity } from "components/Modals";
import { StakeActions } from "components/Modals/StakeActions";

interface IPoolCards {
	stakeTokens?: [];
	stakeOf?: string;
	stakeApr?: string;
	stakeTotalStake?: string;
	stakeYourRate?: string;
	stakeDepositFee?: string;
	stakeYourStaked?: string;
	stakeYourUnclaimed?: string;
}

export const StakeCards: FunctionComponent<IPoolCards> = props => {
	const {
		stakeTokens,
		stakeOf,
		stakeApr,
		stakeTotalStake,
		stakeYourRate,
		stakeDepositFee,
		stakeYourStaked,
		stakeYourUnclaimed,
	} = props;
	const theme = usePicasso();
	const { isOpenStakeActions, onOpenStakeActions, onCloseStakeActions } =
		useModal();

	const [buttonId, setButtonId] = useState<string>("");

	return (
		<Flex
			zIndex="1"
			flexDirection="column"
			w={["18rem", "xs", "2xl", "2xl"]}
			h="max-content"
			alignItems={["flex-start", "flex-start", "center", "center"]}
			gap="8"
			borderRadius="2xl"
			border="1px solid transparent"
			background={`linear-gradient(${theme.bg.blueNavy}, ${theme.bg.blueNavy}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
		>
			<StakeActions
				isOpen={isOpenStakeActions}
				onClose={onCloseStakeActions}
				buttonId={buttonId}
				setButtonId={setButtonId}
			/>
			<Flex
				id="header"
				bg="rgba(255, 255, 255, 0.04)"
				justifyContent="center"
				flexDirection="row"
				pt="3"
				pb="2"
				px={["8", "8", "6", "6"]}
				alignItems="center"
				borderBottomRadius="2xl"
				w="max-content"
				margin="0 auto"
				gap="2"
			>
				<Img src="icons/pegasys.png" w="6" h="6" />
				<Text>Earn {stakeOf}</Text>
				<Button
					id="claim"
					border="1px solid"
					borderColor={theme.text.cyan}
					borderRadius="full"
					w="max-content"
					h="max-content"
					bgColor="transparent"
					py="1"
					fontSize="xs"
					ml="1"
					onClick={(event: any) => {
						setButtonId(event?.currentTarget?.id);
						onOpenStakeActions();
					}}
				>
					Claim
				</Button>
			</Flex>
			<Grid
				templateColumns={[
					"repeat(1, 1fr)",
					"repeat(1, 1fr)",
					"repeat(3, 1fr)",
					"repeat(3, 1fr)",
				]}
				gap="2rem"
				pl={["8", "8", "0", "0"]}
			>
				<GridItem flexDirection="column">
					<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
						APR
					</Text>
					<Text fontWeight="medium" fontSize="md">
						1 {stakeApr}
					</Text>
				</GridItem>
				<GridItem flexDirection="column">
					<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
						Total staked (PSYS)
					</Text>
					<Text fontWeight="medium" fontSize="md">
						1 {stakeTotalStake}
					</Text>
				</GridItem>
				<GridItem flexDirection="column">
					<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
						Your rate (PSYS/Week)
					</Text>
					<Text fontWeight="medium" fontSize="md">
						1 {stakeYourRate}
					</Text>
				</GridItem>
				<GridItem flexDirection="column">
					<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
						Deposit Fee
					</Text>
					<Text fontWeight="medium" fontSize="md">
						1 {stakeDepositFee}%
					</Text>
				</GridItem>
				<GridItem flexDirection="column">
					<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
						Your Staked PSYS
					</Text>
					<Text fontWeight="medium" fontSize="md">
						1 {stakeYourStaked}
					</Text>
				</GridItem>
				<GridItem flexDirection="column">
					<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
						Your unclaimed PSYS
					</Text>
					<Text fontWeight="medium" fontSize="md">
						1 {stakeYourUnclaimed}
					</Text>
				</GridItem>
			</Grid>
			<Flex
				justifyContent="center"
				gap={["2", "2", "6", "6"]}
				mb="6"
				flexDirection="row"
				alignItems="center"
				ml={["2.2rem", "2.2rem", "0", "0"]}
			>
				<Button
					id="unstake"
					width={["6.5rem", "8rem", "11.5rem", "11.5rem"]}
					height="2rem"
					bgColor="transparent"
					border="1px solid"
					borderColor={theme.text.cyan}
					borderRadius="full"
					py="2"
					px="0.75rem"
					fontSize="sm"
					fontWeight="semibold"
					onClick={(event: any) => {
						setButtonId(event?.currentTarget?.id);
						onOpenStakeActions();
					}}
				>
					Unstake
				</Button>
				<Button
					id="stake"
					width={["6.5rem", "8rem", "11.5rem", "11.5rem"]}
					height="2rem"
					bgColor={theme.bg.blueNavyLightness}
					color={theme.text.cyan}
					borderRadius="full"
					py="2"
					px="0.75rem"
					fontSize="sm"
					fontWeight="semibold"
					onClick={(event: any) => {
						setButtonId(event?.currentTarget?.id);
						onOpenStakeActions();
					}}
				>
					Stake
				</Button>
			</Flex>
		</Flex>
	);
};
