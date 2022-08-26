import { Button, Flex, Img, Text } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { useModal, usePicasso } from "hooks";
import { FarmActions } from "components/Modals/FarmActions";

interface IPoolCards {
	farmOf?: [];
	totalStaked?: string;
	yourStake?: string;
	swapFeeApr?: string;
	superFarmApr?: string;
	totalApr?: string;
	yourRate?: string;
	yourUnclaimed?: string;
}

export const FarmCards: FunctionComponent<IPoolCards> = props => {
	const {
		farmOf,
		totalStaked,
		yourStake,
		swapFeeApr,
		superFarmApr,
		totalApr,
		yourRate,
		yourUnclaimed,
	} = props;
	const theme = usePicasso();

	const { isOpenFarmActions, onOpenFarmActions, onCloseFarmActions } =
		useModal();

	const [buttonId, setButtonId] = useState<string>("");

	return (
		<Flex
			w="xs"
			h="max-content"
			d="inline-block"
			flexDirection="column"
			backgroundColor={theme.bg.blueNavy}
			px="6"
			pb="6"
			mb="4"
			borderRadius="xl"
			border="1px solid transparent;"
			background={`linear-gradient(${theme.bg.blueNavy}, ${theme.bg.blueNavy}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
		>
			<FarmActions
				isOpen={isOpenFarmActions}
				onClose={onCloseFarmActions}
				buttonId={buttonId}
				setButtonId={setButtonId}
			/>
			<Flex justifyContent="space-between">
				<Flex gap="2" pt="6">
					<Flex>
						<Img src="icons/syscoin-logo.png" w="6" h="6" />
						<Img src="icons/pegasys.png" w="6" h="6" />
					</Flex>
					<Text className="text" fontSize="lg" fontWeight="bold">
						{farmOf}
					</Text>
				</Flex>
				<Flex
					alignItems="flex-end"
					justifyContent="center"
					w="15%"
					h="3rem"
					backgroundColor={theme.bg.iconTicket}
					borderBottomRadius="full"
				>
					<Img src="icons/pegasys.png" w="6" h="6" mb="0.6rem" />
				</Flex>
			</Flex>
			<Flex flexDirection="column" pt="6">
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold" color={theme.text.cyanPurple}>
						Total Staked
					</Text>
					<Text color={theme.text.cyanPurple}>${totalStaked}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold">Your Stake</Text>
					<Text>${yourStake}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold">Swap Fee APR</Text>
					<Text>{swapFeeApr}%</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold">Super Farm APR</Text>
					<Text>{superFarmApr}%</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold">Total APR</Text>
					<Text>{totalApr}%</Text>
				</Flex>
			</Flex>
			<Flex
				flexDirection="column"
				backgroundColor={theme.bg.farmRate}
				borderRadius="0.375rem"
				py="0.5rem"
				px="1rem"
				mt="0.688rem"
				mb="1.5rem"
			>
				<Flex justifyContent="space-between" pb="0.75rem" fontSize="sm">
					<Text fontWeight="semibold">Your Rate</Text>
					<Text>{yourRate} PSYS/Week</Text>
				</Flex>
				<Flex justifyContent="space-between" fontSize="sm">
					<Text fontWeight="semibold">Your Unclaimed PSYS</Text>
					<Text>{yourUnclaimed}</Text>
				</Flex>
			</Flex>
			<Flex justifyContent="space-between" py="1" flexDirection="row">
				<Button
					id="withdraw"
					fontSize="sm"
					fontWeight="semibold"
					py="0.625rem"
					px="1.5rem"
					w="8.125rem"
					h="max-content"
					bgColor={theme.bg.blueNavyLightness}
					color={theme.text.cyan}
					_hover={{
						opacity: "1",
						bgColor: theme.bg.bluePurple,
					}}
					_active={{}}
					borderRadius="full"
					onClick={(event: React.ChangeEvent<HTMLInputElement>) => {
						setButtonId(event?.currentTarget?.id);
						onOpenFarmActions();
					}}
				>
					Withdraw
				</Button>
				<Button
					id="deposit"
					fontSize="sm"
					fontWeight="semibold"
					py="0.625rem"
					px="1.5rem"
					w="8.125rem"
					h="max-content"
					bgColor={theme.bg.blueNavyLightness}
					color={theme.text.cyan}
					_hover={{
						opacity: "1",
						bgColor: theme.bg.bluePurple,
					}}
					_active={{}}
					borderRadius="full"
					onClick={(event: React.ChangeEvent<HTMLInputElement>) => {
						setButtonId(event?.currentTarget?.id);
						onOpenFarmActions();
					}}
				>
					Deposit
				</Button>
			</Flex>
			<Button
				id="claim"
				w="100%"
				mt="1rem"
				py="1"
				px="6"
				borderRadius="full"
				bgColor="transparent"
				borderWidth="1px"
				color={theme.text.whitePurple}
				borderColor={theme.text.cyanPurple}
				fontSize="sm"
				fontWeight="semibold"
				onClick={(event: React.ChangeEvent<HTMLInputElement>) => {
					setButtonId(event?.currentTarget?.id);
					onOpenFarmActions();
				}}
				_hover={{
					borderColor: theme.text.cyanLightPurple,
					color: theme.text.cyanLightPurple,
				}}
			>
				Claim
			</Button>
		</Flex>
	);
};
