import { Button, Flex, Img, Text } from "@chakra-ui/react";
import { FunctionComponent, SetStateAction, useMemo, useState } from "react";
import { useModal, usePicasso, useWallet } from "hooks";
import {
	getBalanceOfBNSingleCall,
	getTotalSupply,
	removeScientificNotation,
	unwrappedToken,
} from "utils";
import {
	ChainId,
	JSBI,
	Pair,
	Percent,
	Token,
	TokenAmount,
} from "@pollum-io/pegasys-sdk";
import { WrappedTokenInfo, IDeposited, ICommonPairs } from "types";
import { Signer } from "ethers";
import { PAIR_DATA, pegasysClient } from "apollo";
import { formattedNum, formattedPercent } from "utils/numberFormat";

interface IPoolCards {
	poolApr?: string;
	setIsCreate: React.Dispatch<SetStateAction<boolean>>;
	pair?: Pair;
	userTokens?: WrappedTokenInfo[];
	setSelectedToken: React.Dispatch<React.SetStateAction<WrappedTokenInfo[]>>;
	setCurrPair: React.Dispatch<React.SetStateAction<Pair | undefined>>;
	setSliderValue: React.Dispatch<React.SetStateAction<number>>;
	setDepositedTokens: React.Dispatch<
		React.SetStateAction<IDeposited | undefined>
	>;
	setPoolPercentShare: React.Dispatch<React.SetStateAction<string>>;
	setUserPoolBalance: React.Dispatch<React.SetStateAction<string>>;
	pairInfo: ICommonPairs | undefined;
}

export const PoolCards: FunctionComponent<IPoolCards> = props => {
	const {
		poolApr,
		setIsCreate,
		pair,
		userTokens,
		setSelectedToken,
		setCurrPair,
		setSliderValue,
		setDepositedTokens,
		setPoolPercentShare,
		setUserPoolBalance,
		pairInfo,
	} = props;
	const theme = usePicasso();
	const { onOpenRemoveLiquidity, onOpenAddLiquidity } = useModal();
	const {
		setCurrentLpAddress,
		signer,
		walletAddress,
		currentNetworkChainId,
		provider,
	} = useWallet();
	const [poolBalance, setPoolBalance] = useState<string>("");
	const [percentShare, setPercentShare] = useState<string>("");
	const [volume, setVolume] = useState<string>("");
	const [trigger, setTrigger] = useState<boolean>(false);

	const chainId =
		currentNetworkChainId === 57 ? ChainId.NEVM : ChainId.TANENBAUM;

	const currencyA = unwrappedToken(pair?.token0 as Token);
	const currencyB = unwrappedToken(pair?.token1 as Token);

	const wrapTokenA = userTokens?.find(
		token => token.symbol === currencyA.symbol
	) as WrappedTokenInfo;
	const wrapTokenB = userTokens?.find(
		token => token.symbol === currencyB.symbol
	) as WrappedTokenInfo;

	const handleMethods = (isRemove: boolean) => {
		if (isRemove) {
			onOpenRemoveLiquidity();
			setCurrentLpAddress(`${pair?.liquidityToken.address}`);
			setSelectedToken([wrapTokenA, wrapTokenB]);
			setTrigger(!trigger);
			setCurrPair(pair);
			setSliderValue(0);
			return;
		}
		setIsCreate(false);
		onOpenAddLiquidity();
		setCurrPair(pair);
		setTrigger(!trigger);
		setCurrentLpAddress(`${pair?.liquidityToken.address}`);
		setSelectedToken([wrapTokenA, wrapTokenB]);
	};

	useMemo(async () => {
		const pairBalance = await getBalanceOfBNSingleCall(
			pair?.liquidityToken.address as string,
			walletAddress,
			signer
		);

		const value = JSBI.BigInt(pairBalance?.toString());

		const pairBalanceAmount = new TokenAmount(
			pair?.liquidityToken as Token,
			value
		);

		const totalSupply = await getTotalSupply(
			pair?.liquidityToken as Token,
			signer as Signer,
			provider
		);

		const poolTokenPercentage =
			pairBalanceAmount &&
			totalSupply &&
			JSBI.greaterThanOrEqual(totalSupply.raw, pairBalanceAmount.raw)
				? new Percent(pairBalanceAmount.raw, totalSupply.raw)
				: undefined;

		const [token0Deposited, token1Deposited] =
			!!pair &&
			!!totalSupply &&
			!!pairBalanceAmount &&
			// this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
			JSBI.greaterThanOrEqual(totalSupply.raw, pairBalanceAmount.raw)
				? [
						pair.getLiquidityValue(
							pair.token0,
							totalSupply,
							pairBalanceAmount,
							false
						),
						pair.getLiquidityValue(
							pair.token1,
							totalSupply,
							pairBalanceAmount,
							false
						),
				  ]
				: [undefined, undefined];

		const amount = `${removeScientificNotation(
			+pairBalanceAmount.toSignificant(5)
		)}`;

		// it only works on mainnet
		const fetchVolume = await pegasysClient.query({
			query: PAIR_DATA(`${Pair.getAddress(wrapTokenA, wrapTokenB, chainId)}`),
			fetchPolicy: "cache-first",
		});

		const pairVolume = fetchVolume?.data?.pairs[0]?.volumeUSD;

		setPoolPercentShare(
			Number(poolTokenPercentage?.toSignificant(6)).toFixed(2)
		);
		setDepositedTokens({ token0: token0Deposited, token1: token1Deposited });
		setPercentShare(Number(poolTokenPercentage?.toSignificant(6)).toFixed(2));
		setPoolBalance(amount);
		setUserPoolBalance(amount);
		setVolume(`${pairVolume || 0}`);
	}, [pair, trigger]);

	const reserveUSD =
		pairInfo &&
		pairInfo.oneDay?.[`${currencyA.symbol}-${currencyB.symbol}`] &&
		formattedNum(
			Number(
				pairInfo.oneDay?.[`${currencyA.symbol}-${currencyB.symbol}`]?.reserveUSD
			),
			true
		);

	const volumeUSD =
		pairInfo &&
		pairInfo.oneDay?.[`${currencyA.symbol}-${currencyB.symbol}`] &&
		formattedNum(
			Number(
				pairInfo.oneDay?.[`${currencyA.symbol}-${currencyB.symbol}`]?.volumeUSD
			),
			true
		);

	const apr =
		pairInfo?.oneDay?.[`${currencyA.symbol}-${currencyB.symbol}`] &&
		pairInfo?.general?.[`${currencyA.symbol}-${currencyB.symbol}`] &&
		formattedPercent(
			pairInfo?.oneDay?.[`${currencyA.symbol}-${currencyB.symbol}`]?.volumeUSD,
			pairInfo?.general?.[`${currencyA.symbol}-${currencyB.symbol}`]?.volumeUSD
		);

	return (
		<Flex
			flexDirection="column"
			p="6"
			w="xs"
			borderRadius="xl"
			border="1px solid rgb(86,190,216, 0.4)"
			background={theme.bg.blackAlpha}
			display={
				pairInfo?.oneDay?.[`${currencyA.symbol}-${currencyB.symbol}`]
					? ""
					: "none"
			}
		>
			<Flex gap="2">
				<Flex>
					<Img src={wrapTokenA?.logoURI} w="6" h="6" />
					<Img src={wrapTokenB?.logoURI} w="6" h="6" />
				</Flex>
				<Text fontSize="lg" fontWeight="bold">
					{pair ? `${currencyA.symbol}/${currencyB.symbol}` : ""}
				</Text>
			</Flex>
			<Flex flexDirection="column" pt="6">
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold" color={theme.text.mono}>
						Liquidity
					</Text>
					<Text>{reserveUSD || "-"}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold" color={theme.text.mono}>
						Volume
					</Text>
					<Text>{volumeUSD || "-"}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold" color={theme.text.mono}>
						APR
					</Text>
					<Text>{apr}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text
						fontWeight="semibold"
						color={percentShare === "0.00" ? theme.text.manageInput : ""}
					>
						Your pool share
					</Text>
					<Text color={percentShare === "0.00" ? theme.text.manageInput : ""}>
						{percentShare !== "0.00" ? `${percentShare}%` : "-"}
					</Text>
				</Flex>
			</Flex>
			<Flex gap="2" mt="1.5rem">
				<Button
					display={+poolBalance === 0 ? "none" : ""}
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
					onClick={() => {
						handleMethods(true);
					}}
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
						handleMethods(false);
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
