import { Flex, Img, Text } from "@chakra-ui/react";
import { FunctionComponent, useMemo } from "react";
import { useModal, usePicasso, useTokens } from "hooks";
import { IFarmInfo, useEarn, TButtonId, BIG_INT_ZERO } from "pegasys-services";
import { JSBI, Pair } from "@pollum-io/pegasys-sdk";
import { formattedNum } from "utils/numberFormat";
import { WrappedTokenInfo } from "types";
import { EarnButton } from "../Earn";

const FarmCard: FunctionComponent<{
	stakeInfo: IFarmInfo;
	setCurrPair: React.Dispatch<React.SetStateAction<Pair | undefined>>;
	setSelectedToken: React.Dispatch<React.SetStateAction<WrappedTokenInfo[]>>;
}> = ({ stakeInfo, setCurrPair, setSelectedToken }) => {
	const {
		tokenA,
		tokenB,
		swapFeeApr,
		superFarmApr,
		combinedApr,
		stakedAmount,
		unclaimedAmount,
		unstakedAmount,
		rewardRatePerWeek,
		totalStakedInUsd,
		stakedInUsd,
		rewardToken,
		extraRewardToken,
		pair,
	} = stakeInfo;

	const theme = usePicasso();
	const { userTokensBalance } = useTokens();
	const { setSelectedOpportunity, setButtonId } = useEarn();
	const { onOpenFarmActions, onOpenAddLiquidity } = useModal();

	const wrapTokenA = useMemo(() => {
		const wrapToken = userTokensBalance.find(
			ut => ut.symbol === tokenA?.symbol
		);

		return wrapToken;
	}, [userTokensBalance, tokenA]);

	const wrapTokenB = useMemo(() => {
		const wrapToken = userTokensBalance.find(
			ut => ut.symbol === tokenB?.symbol
		);

		return wrapToken;
	}, [userTokensBalance, tokenB]);

	const onClick = (id: string) => {
		setButtonId(id as TButtonId);
		setSelectedOpportunity(stakeInfo);
		onOpenFarmActions();
	};

	const tokenALogo = useMemo(() => {
		const tokenAWrapped = userTokensBalance.find(
			ut => ut.address === tokenA?.address && tokenA.chainId === ut.chainId
		);

		return tokenAWrapped?.logoURI ?? "";
	}, [userTokensBalance, tokenA]);

	const tokenBLogo = useMemo(() => {
		const tokenBWrapped = userTokensBalance.find(
			ut => ut.address === tokenB?.address && tokenB.chainId === ut.chainId
		);

		return tokenBWrapped?.logoURI ?? "";
	}, [userTokensBalance, tokenB]);

	const extraTokenLogo = useMemo(() => {
		const extraTokenWrapped = userTokensBalance.find(
			ut =>
				ut.address === extraRewardToken?.address &&
				extraRewardToken.chainId === ut.chainId
		);

		return extraTokenWrapped?.logoURI ?? "";
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
						<Img src={tokenALogo} w="6" h="6" />
						<Img
							src={tokenBLogo}
							w="6"
							h="6"
							position="relative"
							right="0.3rem"
						/>
					</Flex>
					<Text className="text" fontSize="lg" fontWeight="bold">
						{tokenA.symbol}-{tokenB?.symbol ?? ""}
					</Text>
				</Flex>
				{!!superFarmApr && (
					<Flex
						alignItems="flex-end"
						justifyContent="center"
						w="15%"
						h="3rem"
						backgroundColor={theme.bg.smoothGray}
						borderBottomRadius="full"
					>
						<Img src={extraTokenLogo} w="6" h="6" mb="0.6rem" />
					</Flex>
				)}
			</Flex>
			<Flex flexDirection="column" pt="6">
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold" color={theme.text.cyanPurple}>
						Total Staked
					</Text>
					<Text color={theme.text.cyanPurple}>
						{formattedNum(totalStakedInUsd, true)}
					</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold">Your Stake</Text>
					<Text>{formattedNum(stakedInUsd, true)}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold">Swap Fee APR</Text>
					<Text>{swapFeeApr}%</Text>
				</Flex>
				{!!superFarmApr && (
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
			{(JSBI.greaterThan(rewardRatePerWeek.raw, BIG_INT_ZERO) ||
				JSBI.greaterThan(unclaimedAmount.raw, BIG_INT_ZERO)) && (
				<Flex
					flexDirection="column"
					backgroundColor={theme.bg.neutralGray}
					borderRadius="0.375rem"
					py="0.5rem"
					px="1rem"
					mt="0.688rem"
					mb="1.5rem"
				>
					<Flex justifyContent="space-between" py="1.5" fontSize="sm">
						<Text fontWeight="semibold">Your Rate</Text>
						<Text>
							{rewardRatePerWeek.toFixed(8)} {rewardToken.symbol}/Week
						</Text>
					</Flex>
					<Flex justifyContent="space-between" py="1.5" fontSize="sm">
						<Text fontWeight="semibold">Your Unclaimed</Text>
						<Text>
							{unclaimedAmount.toSignificant()} {rewardToken.symbol}
						</Text>
					</Flex>
				</Flex>
			)}
			<Flex gap="2" py="1">
				<EarnButton
					id="withdraw"
					py="0.625rem"
					px="1.5rem"
					height="max-content"
					onClick={onClick}
					amount={stakedAmount}
					solid
				>
					Withdraw
				</EarnButton>
				<EarnButton
					id="deposit"
					py="0.625rem"
					px="1.5rem"
					height="max-content"
					onClick={onClick}
					amount={unstakedAmount}
					solid
				>
					Deposit
				</EarnButton>
			</Flex>
			<EarnButton
				id="claim"
				py="0.625rem"
				px="1.5rem"
				mt="1rem"
				height="max-content"
				onClick={onClick}
				amount={unclaimedAmount}
			>
				Claim
			</EarnButton>
			{JSBI.greaterThanOrEqual(BIG_INT_ZERO, stakedAmount.raw) &&
				JSBI.greaterThanOrEqual(BIG_INT_ZERO, unstakedAmount.raw) &&
				JSBI.greaterThanOrEqual(BIG_INT_ZERO, unclaimedAmount.raw) && (
					<EarnButton
						py="0.625rem"
						height="max-content"
						px="1.5rem"
						mt="1rem"
						onClick={() => {
							onOpenAddLiquidity();
							setSelectedToken([wrapTokenA, wrapTokenB] as WrappedTokenInfo[]);
							setCurrPair(pair);
						}}
					>
						{`Add ${tokenA.symbol}-${tokenB?.symbol} Liquidity`}
					</EarnButton>
				)}
		</Flex>
	);
};

export default FarmCard;
