import { Button, Flex, Img, Text, useDisclosure } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { usePicasso } from "hooks";
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
	const { onOpen, isOpen, onClose } = useDisclosure();
	const [buttonId, setButtonId] = useState<string>("");

	return (
		<Flex
			zIndex="1"
			flexDirection="column"
			w="2xl"
			h="max-content"
			gap="8"
			borderRadius="2xl"
			border="1px solid transparent;"
			background={`linear-gradient(${theme.bg.blueNavy}, ${theme.bg.blueNavy}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
		>
			<StakeActions
				isOpen={isOpen}
				onClose={onClose}
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
				px="6"
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
					onClick={(event: React.MouseEvent<HTMLInputElement>) => {
						setButtonId(event?.currentTarget?.id);
						onOpen();
					}}
				>
					Claim
				</Button>
			</Flex>
			<Flex flexDirection="row" flexWrap="wrap" gap="4">
				<Flex flexDirection="column" mr="40" ml="7">
					<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
						APR
					</Text>
					<Text fontWeight="medium" fontSize="md">
						{stakeApr}
					</Text>
				</Flex>
				<Flex flexDirection="column" mr="24">
					<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
						Total staked (PSYS)
					</Text>
					<Text fontWeight="medium" fontSize="md">
						{stakeTotalStake}
					</Text>
				</Flex>
				<Flex flexDirection="column">
					<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
						Your rate (PSYS/Week)
					</Text>
					<Text fontWeight="medium" fontSize="md">
						{stakeYourRate}
					</Text>
				</Flex>
				<Flex flexDirection="column" ml="7" mr="7.4rem">
					<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
						Deposit Fee
					</Text>
					<Text fontWeight="medium" fontSize="md">
						{stakeDepositFee}%
					</Text>
				</Flex>
				<Flex flexDirection="column" mr="6.7rem">
					<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
						Your Staked PSYS
					</Text>
					<Text fontWeight="medium" fontSize="md">
						{stakeYourStaked}
					</Text>
				</Flex>
				<Flex flexDirection="column">
					<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
						Your unclaimed PSYS
					</Text>
					<Text fontWeight="medium" fontSize="md">
						{stakeYourUnclaimed}
					</Text>
				</Flex>
			</Flex>
			<Flex justifyContent="center" gap="6" mb="6">
				<Button
					id="unstake"
					width="11.5rem"
					height="2rem"
					bgColor="transparent"
					border="1px solid"
					borderColor={theme.text.cyan}
					borderRadius="full"
					py="2"
					px="0.75rem"
					fontSize="sm"
					fontWeight="semibold"
					onClick={(event: React.MouseEvent<HTMLInputElement>) => {
						setButtonId(event?.currentTarget?.id);
						onOpen();
					}}
				>
					Unstake
				</Button>
				<Button
					id="stake"
					width="11.5rem"
					height="2rem"
					bgColor={theme.bg.blueNavyLightness}
					color={theme.text.cyan}
					borderRadius="full"
					py="2"
					px="0.75rem"
					fontSize="sm"
					fontWeight="semibold"
					onClick={(event: React.MouseEvent<HTMLInputElement>) => {
						setButtonId(event?.currentTarget?.id);
						onOpen();
					}}
				>
					Stake
				</Button>
			</Flex>
		</Flex>
	);
};
