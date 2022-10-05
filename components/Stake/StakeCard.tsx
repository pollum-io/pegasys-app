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
import { IStakeInfo, useStake } from "pegasys-services";
import { JSBI } from "@pollum-io/pegasys-sdk";

interface IPoolCards {
	stakeInfo?: IStakeInfo;
}

export const StakeCards: FunctionComponent<IPoolCards> = props => {
	const { stakeInfo } = props;
	const theme = usePicasso();
	const { isOpenStakeActions, onOpenStakeActions, onCloseStakeActions } =
		useModal();

	const [buttonId, setButtonId] = useState<string>("");
	const { colorMode } = useColorMode();
	const { setSelectedStake } = useStake();

	const onClick = (id: string) => {
		setButtonId(id);
		setSelectedStake(stakeInfo);
		onOpenStakeActions();
	};

	if (!stakeInfo) {
		return null;
	}

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
				<Text color={theme.text.whitePurple}>Earn PSYS</Text>
				{JSBI.greaterThan(stakeInfo.earnedAmount.raw, JSBI.BigInt(0)) && (
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
						onClick={event => onClick(event.currentTarget.id)}
						_hover={{
							borderColor: theme.text.cyanLightPurple,
							color: theme.text.cyanLightPurple,
						}}
					>
						Claim
					</Button>
				)}
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
						{stakeInfo.apr.toString()}%
					</Text>
				</GridItem>
				<GridItem flexDirection="column">
					<Text fontSize="sm" color={theme.text.cyanPurple}>
						Total staked
					</Text>
					<Text fontWeight="medium" fontSize="md" color={theme.text.mono}>
						{stakeInfo.totalStakedAmount.toFixed(10, { groupSeparator: "," })}{" "}
						PSYS
					</Text>
				</GridItem>
				<GridItem flexDirection="column" pl={["0", "0", "6", "6"]}>
					<Text fontSize="sm" color={theme.text.cyanPurple}>
						Your rate
					</Text>
					<Text fontWeight="medium" fontSize="md" color={theme.text.mono}>
						{stakeInfo.rewardRatePerWeek.toFixed(10, {
							groupSeparator: ",",
						})}{" "}
						(PSYS/Week)
					</Text>
				</GridItem>
				<GridItem flexDirection="column">
					<Text fontSize="sm" color={theme.text.cyanPurple}>
						Your Staked
					</Text>
					<Text fontWeight="medium" fontSize="md" color={theme.text.mono}>
						{stakeInfo.stakedAmount.toFixed(10, {
							groupSeparator: ",",
						})}{" "}
						PSYS
					</Text>
				</GridItem>
				<GridItem flexDirection="column" pl={["0", "0", "6", "6"]}>
					<Text fontSize="sm" color={theme.text.cyanPurple}>
						Your unclaimed
					</Text>
					<Text fontWeight="medium" fontSize="md" color={theme.text.mono}>
						{stakeInfo.earnedAmount.toFixed(10, {
							groupSeparator: ",",
						})}{" "}
						PSYS
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
				{JSBI.greaterThan(stakeInfo.stakedAmount.raw, JSBI.BigInt(0)) && (
					<Button
						id="unstake"
						width={["6.5rem", "8rem", "11.5rem", "11.5rem"]}
						h="2.2rem"
						bgColor="transparent"
						border="1px solid"
						borderColor={theme.text.cyanPurple}
						color={theme.text.whitePurple}
						borderRadius="full"
						py={["0.2rem", "0.2rem", "1", "1"]}
						px="0.75rem"
						fontSize="sm"
						fontWeight="semibold"
						onClick={event => onClick(event.currentTarget.id)}
						_hover={{
							borderColor: theme.text.cyanLightPurple,
							color: theme.text.cyanLightPurple,
						}}
					>
						Unstake
					</Button>
				)}
				{JSBI.greaterThan(stakeInfo.unstakedPsysAmount.raw, JSBI.BigInt(0)) && (
					<Button
						id="stake"
						width={["6.5rem", "8rem", "11.5rem", "11.5rem"]}
						h="2.2rem"
						bgColor={theme.bg.blueNavyLightness}
						color={theme.text.cyan}
						borderRadius="full"
						py={["0.2rem", "0.2rem", "1", "1"]}
						px="0.75rem"
						fontSize="sm"
						fontWeight="semibold"
						onClick={event => onClick(event.currentTarget.id)}
						_hover={{
							bgColor: theme.bg.bluePurple,
						}}
					>
						Stake
					</Button>
				)}
			</Flex>
		</Flex>
	);
};
