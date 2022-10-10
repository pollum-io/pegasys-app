import { Button, Flex, Img, Text } from "@chakra-ui/react";
import { FunctionComponent, useMemo, useState } from "react";
import { useModal, usePicasso, useTokens } from "hooks";
import { FarmActions } from "components/Modals/FarmActions";
import { IFarmInfo, useFarm } from "pegasys-services";
import { JSBI } from "@pollum-io/pegasys-sdk";
import { formattedNum } from "utils/numberFormat";

const FarmCard: FunctionComponent<{ stakeInfo: IFarmInfo }> = ({
	stakeInfo,
}) => {
	const {
		tokenA,
		tokenB,
		swapFeeApr,
		superFarmApr,
		combinedApr,
		userStakedAmount,
		totalStakedAmount,
		unclaimedPSYSAmount,
		userAvailableLpTokenAmount,
		userRewardRatePerWeek,
		totalStakedInUsd,
	} = stakeInfo;

	const theme = usePicasso();
	const { userTokensBalance } = useTokens();
	const { setSelectedPair, setButtonId } = useFarm();

	const { onOpenFarmActions } = useModal();

	// const [buttonId, setButtonId] = useState<string>("");

	const onClick = (id: string) => {
		setButtonId(id);
		setSelectedPair(stakeInfo);
		onOpenFarmActions();
	};

	const tokenBLogo = useMemo(() => {
		const tokenBWrapped = userTokensBalance.find(
			ut => ut.address === tokenB.address && tokenB.chainId === ut.chainId
		);

		return tokenBWrapped?.logoURI ?? "";
	}, [userTokensBalance, tokenB]);

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
			<Flex justifyContent="space-between">
				<Flex gap="2" pt="6">
					<Flex>
						<Img src={tokenA.tokenInfo.logoURI} w="6" h="6" />
						<Img src={tokenBLogo} w="6" h="6" />
					</Flex>
					<Text className="text" fontSize="lg" fontWeight="bold">
						farm of
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
					<Text color={theme.text.cyanPurple}>
						{formattedNum(Number(totalStakedInUsd.toSignificant(4)), true)}
					</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold">Your Stake</Text>
					<Text>${userStakedAmount.raw.toString()}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold">Swap Fee APR</Text>
					<Text>{swapFeeApr}%</Text>
				</Flex>
				{superFarmApr && (
					<>
						<Flex justifyContent="space-between" pb="3" fontSize="sm">
							<Text fontWeight="semibold">Super Farm APR</Text>
							<Text>{superFarmApr}%</Text>
						</Flex>
						<Flex justifyContent="space-between" pb="3" fontSize="sm">
							<Text fontWeight="semibold">Total APR</Text>
							<Text>{combinedApr}%</Text>
						</Flex>
					</>
				)}
			</Flex>
			{(JSBI.greaterThan(userRewardRatePerWeek.raw, JSBI.BigInt(0)) ||
				JSBI.greaterThan(unclaimedPSYSAmount.raw, JSBI.BigInt(0))) && (
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
						<Text>
							{userRewardRatePerWeek.toFixed(6, {
								groupSeparator: ",",
							})}{" "}
							PSYS/Week
						</Text>
					</Flex>
					<Flex justifyContent="space-between" fontSize="sm">
						<Text fontWeight="semibold">Your Unclaimed PSYS</Text>
						<Text>
							{unclaimedPSYSAmount.toFixed(6, {
								groupSeparator: ",",
							})}
						</Text>
					</Flex>
				</Flex>
			)}
			<Flex gap="2" py="1" flexDirection="row">
				{JSBI.greaterThan(userStakedAmount.raw, JSBI.BigInt(0)) && (
					<Button
						id="withdraw"
						fontSize="sm"
						fontWeight="semibold"
						py="0.625rem"
						px="1.5rem"
						w="100%"
						h="max-content"
						bgColor={theme.bg.blueNavyLightness}
						color={theme.text.cyan}
						_hover={{
							opacity: "1",
							bgColor: theme.bg.bluePurple,
						}}
						_active={{}}
						borderRadius="full"
						onClick={event => onClick(event.currentTarget.id)}
					>
						Withdraw
					</Button>
				)}
				{JSBI.greaterThan(userAvailableLpTokenAmount.raw, JSBI.BigInt(0)) && (
					<Button
						id="deposit"
						fontSize="sm"
						fontWeight="semibold"
						py="0.625rem"
						px="1.5rem"
						w="100%"
						h="max-content"
						bgColor={theme.bg.blueNavyLightness}
						color={theme.text.cyan}
						_hover={{
							opacity: "1",
							bgColor: theme.bg.bluePurple,
						}}
						_active={{}}
						borderRadius="full"
						onClick={event => onClick(event.currentTarget.id)}
					>
						Deposit
					</Button>
				)}
			</Flex>
			{JSBI.greaterThan(unclaimedPSYSAmount.raw, JSBI.BigInt(0)) && (
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
	);
};

export default FarmCard;
