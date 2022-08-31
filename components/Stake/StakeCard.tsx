import {
	Button,
	Flex,
	Grid,
	GridItem,
	Img,
	Text,
	useColorMode,
} from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { useModal, usePicasso } from "hooks";
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
		stakeOf,
		stakeApr,
		stakeTotalStake,
		stakeYourRate,
		stakeDepositFee,
		stakeYourStaked,
		stakeYourUnclaimed,
		stakeTokens,
	} = props;
	const theme = usePicasso();
	const { isOpenStakeActions, onOpenStakeActions, onCloseStakeActions } =
		useModal();

	const [buttonId, setButtonId] = useState<string>("");
	const { colorMode } = useColorMode();

	return (
		<Flex
			zIndex="1"
			flexDirection="column"
			w={["20rem", "xs", "2xl", "2xl"]}
			h="max-content"
			alignItems={["flex-start", "flex-start", "center", "center"]}
			gap="8"
			borderRadius="2xl"
			border="1px solid transparent"
			boxShadow={
				colorMode === "light"
					? "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05);"
					: "none"
			}
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
				bg={theme.bg.iconTicket}
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
				<Text color={theme.text.whitePurple}>Earn {stakeOf}</Text>
				<Button
					id="claim"
					border="1px solid"
					borderColor={theme.text.cyanPurple}
					borderRadius="full"
					w="max-content"
					h="max-content"
					color={theme.text.whitePurple}
					bgColor="transparent"
					py="1"
					fontSize="xs"
					ml="1"
					onClick={event => {
						setButtonId(event?.currentTarget?.id);
						onOpenStakeActions();
					}}
					_hover={{
						borderColor: theme.text.cyanLightPurple,
						color: theme.text.cyanLightPurple,
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
				gap={["1rem", "1rem", "2rem", "2rem"]}
				pl={["8", "8", "0", "0"]}
			>
				<GridItem flexDirection="column">
					<Text fontSize="sm" color={theme.text.cyanPurple}>
						APR
					</Text>
					<Text fontWeight="medium" fontSize="md" color={theme.text.mono}>
						1 {stakeApr}
					</Text>
				</GridItem>
				<GridItem flexDirection="column">
					<Text fontSize="sm" color={theme.text.cyanPurple}>
						Total staked (PSYS)
					</Text>
					<Text fontWeight="medium" fontSize="md" color={theme.text.mono}>
						1 {stakeTotalStake}
					</Text>
				</GridItem>
				<GridItem flexDirection="column" pl={["0", "0", "6", "6"]}>
					<Text fontSize="sm" color={theme.text.cyanPurple}>
						Your rate (PSYS/Week)
					</Text>
					<Text fontWeight="medium" fontSize="md" color={theme.text.mono}>
						1 {stakeYourRate}
					</Text>
				</GridItem>
				<GridItem flexDirection="column">
					<Text fontSize="sm" color={theme.text.cyanPurple}>
						Deposit Fee
					</Text>
					<Text fontWeight="medium" fontSize="md" color={theme.text.mono}>
						1 {stakeDepositFee}%
					</Text>
				</GridItem>
				<GridItem flexDirection="column">
					<Text fontSize="sm" color={theme.text.cyanPurple}>
						Your Staked PSYS
					</Text>
					<Text fontWeight="medium" fontSize="md" color={theme.text.mono}>
						1 {stakeYourStaked}
					</Text>
				</GridItem>
				<GridItem flexDirection="column" pl={["0", "0", "6", "6"]}>
					<Text fontSize="sm" color={theme.text.cyanPurple}>
						Your unclaimed PSYS
					</Text>
					<Text fontWeight="medium" fontSize="md" color={theme.text.mono}>
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
				ml={["3rem", "3rem", "0", "0"]}
			>
				<Button
					id="unstake"
					width={["6.5rem", "8rem", "11.5rem", "11.5rem"]}
					height="2rem"
					bgColor="transparent"
					border="1px solid"
					borderColor={theme.text.cyanPurple}
					color={theme.text.whitePurple}
					borderRadius="full"
					py="2"
					px="0.75rem"
					fontSize="sm"
					fontWeight="semibold"
					onClick={event => {
						setButtonId(event?.currentTarget?.id);
						onOpenStakeActions();
					}}
					_hover={{
						borderColor: theme.text.cyanLightPurple,
						color: theme.text.cyanLightPurple,
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
					onClick={event => {
						setButtonId(event?.currentTarget?.id);
						onOpenStakeActions();
					}}
					_hover={{
						bgColor: theme.bg.bluePurple,
					}}
				>
					Stake
				</Button>
			</Flex>
		</Flex>
	);
};
