import {
	Flex,
	Grid,
	GridItem,
	Img,
	Text,
	useColorMode,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { useModal, usePicasso } from "hooks";
import { StakeActions } from "components/Modals/StakeActions";
import {
	IEarnInfo,
	IStakeInfo,
	TButtonId,
	useEarn,
	useStake,
} from "pegasys-services";
import { EarnButton } from "../Earn";

interface IPoolCards {
	stakeInfo?: IStakeInfo;
}

export const StakeCards: FunctionComponent<IPoolCards> = props => {
	const { stakeInfo } = props;
	const theme = usePicasso();
	const { isOpenStakeActions, onOpenStakeActions, onCloseStakeActions } =
		useModal();

	const { colorMode } = useColorMode();
	const { setSelectedOpportunity, setButtonId } = useEarn();
	const { showInUsd } = useStake();

	const onClick = (id: string) => {
		setButtonId(id as TButtonId);
		setSelectedOpportunity((stakeInfo as IEarnInfo | undefined) ?? null);
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
			<StakeActions isOpen={isOpenStakeActions} onClose={onCloseStakeActions} />
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
				<Text color={theme.text.whitePurple}>
					Earn {stakeInfo.stakeToken.symbol}
				</Text>
				<EarnButton
					id="claim"
					py="1"
					ml="1"
					width="max-content"
					height="max-content"
					onClick={onClick}
					amount={stakeInfo.unclaimedAmount}
					fontSize="xs"
				>
					Claim
				</EarnButton>
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
						{stakeInfo.totalStakedAmount.toSignificant()}{" "}
						{stakeInfo.stakeToken.symbol}
					</Text>
				</GridItem>
				<GridItem flexDirection="column" pl={["0", "0", "6", "6"]}>
					<Text fontSize="sm" color={theme.text.cyanPurple}>
						Your rate
					</Text>
					<Text fontWeight="medium" fontSize="md" color={theme.text.mono}>
						{stakeInfo.rewardRatePerWeek.toSignificant()}{" "}
						{stakeInfo.rewardToken.symbol}/Week
					</Text>
				</GridItem>
				<GridItem flexDirection="column">
					<Text fontSize="sm" color={theme.text.cyanPurple}>
						Your Staked
					</Text>
					<Text fontWeight="medium" fontSize="md" color={theme.text.mono}>
						{stakeInfo.stakedAmount.toSignificant()}{" "}
						{stakeInfo.stakeToken.symbol}
					</Text>
				</GridItem>
				<GridItem flexDirection="column" pl={["0", "0", "6", "6"]}>
					<Text fontSize="sm" color={theme.text.cyanPurple}>
						Your unclaimed
					</Text>
					<Text fontWeight="medium" fontSize="md" color={theme.text.mono}>
						{stakeInfo.unclaimedAmount.toSignificant()}{" "}
						{stakeInfo.rewardToken.symbol}
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
				<EarnButton
					id="withdraw"
					py={["0.2rem", "0.2rem", "1", "1"]}
					px="0.75rem"
					width={["6.5rem", "8rem", "11.5rem", "11.5rem"]}
					height="2.2rem"
					onClick={onClick}
					amount={stakeInfo.stakedAmount}
				>
					Unstake
				</EarnButton>
				<EarnButton
					id="deposit"
					py={["0.2rem", "0.2rem", "1", "1"]}
					px="0.75rem"
					width={["6.5rem", "8rem", "11.5rem", "11.5rem"]}
					height="2.2rem"
					onClick={onClick}
					amount={stakeInfo.unstakedAmount}
					solid
				>
					Stake
				</EarnButton>
			</Flex>
		</Flex>
	);
};
