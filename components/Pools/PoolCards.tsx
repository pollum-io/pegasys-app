import { Button, Flex, Img, Text } from "@chakra-ui/react";
import { FunctionComponent, SetStateAction, useMemo, useState } from "react";
import { useModal, usePicasso, useWallet, useTokens } from "hooks";
import {
	getBalanceOfBNSingleCall,
	getTotalSupply,
	removeScientificNotation,
	unwrappedToken,
} from "utils";
import {
	JSBI,
	Pair,
	Percent,
	Token,
	TokenAmount,
} from "@pollum-io/pegasys-sdk";
import {
	WrappedTokenInfo,
	IDeposited,
	ICommonPairs,
	IPoolsApr,
	IPoolsWithLiquidity,
	IPoolsLiquidity,
	IPoolsVolume,
} from "types";
import { Signer } from "ethers";
import { formattedNum, formattedPercent } from "utils/numberFormat";
import { pegasysClient, SYS_PRICE } from "apollo";

interface IPoolCards {
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
	setPoolsApr: React.Dispatch<React.SetStateAction<IPoolsApr | undefined>>;
	setPoolsWithLiquidity: React.Dispatch<
		React.SetStateAction<IPoolsWithLiquidity | undefined>
	>;
	setPoolsLiquidity: React.Dispatch<
		React.SetStateAction<IPoolsLiquidity | undefined>
	>;
	setPoolsVolume: React.Dispatch<
		React.SetStateAction<IPoolsVolume | undefined>
	>;
	pairInfo: ICommonPairs | undefined;
}

export const PoolCards: FunctionComponent<IPoolCards> = props => {
	const {
		setIsCreate,
		pair,
		userTokens,
		setSelectedToken,
		setCurrPair,
		setSliderValue,
		setDepositedTokens,
		setPoolPercentShare,
		setUserPoolBalance,
		setPoolsApr,
		setPoolsWithLiquidity,
		setPoolsLiquidity,
		setPoolsVolume,
		pairInfo,
	} = props;
	const theme = usePicasso();
	const { onOpenRemoveLiquidity, onOpenAddLiquidity } = useModal();
	const {
		setCurrentLpAddress,
		signer,
		walletAddress,
		provider,
		currentNetworkChainId,
	} = useWallet();
	const { userTokensBalance } = useTokens();
	const [poolBalance, setPoolBalance] = useState<string>("");
	const [percentShare, setPercentShare] = useState<number>(0);
	const [sysPrice, setSysPrice] = useState<number>(0);
	const [trigger, setTrigger] = useState<boolean>(false);

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

		const fetchSysPrice = await pegasysClient.query({
			query: SYS_PRICE(),
			fetchPolicy: "cache-first",
		});

		const sysPrice = fetchSysPrice?.data?.bundles[0]?.sysPrice;
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

		setPoolPercentShare(
			Number(poolTokenPercentage?.toSignificant(6)).toFixed(2)
		);
		setDepositedTokens({ token0: token0Deposited, token1: token1Deposited });
		setPercentShare(Number(poolTokenPercentage?.toSignificant(6)));
		setPoolBalance(amount);
		setUserPoolBalance(amount);
		setSysPrice(+sysPrice);
	}, [pair, trigger]);

	const reserveUSD =
		pairInfo &&
		pairInfo.general?.[`${currencyA.symbol}-${currencyB.symbol}`] &&
		formattedNum(
			Number(
				pairInfo.general?.[`${currencyA.symbol}-${currencyB.symbol}`]
					?.trackedReserveSYS
			) * sysPrice,
			true
		);

	const volumeUSD =
		pairInfo &&
		pairInfo.oneDay?.[`${currencyA.symbol}-${currencyB.symbol}`] &&
		formattedNum(
			Number(
				pairInfo.general?.[`${currencyA.symbol}-${currencyB.symbol}`]?.volumeUSD
			) -
				Number(
					pairInfo.oneDay?.[`${currencyA.symbol}-${currencyB.symbol}`]
						?.volumeUSD
				),
			true
		);

	const currentDayVolume =
		parseFloat(
			`${
				pairInfo?.general?.[`${currencyA.symbol}-${currencyB.symbol}`]
					?.volumeUSD
			}`
		) -
		parseFloat(
			`${
				pairInfo?.oneDay?.[`${currencyA.symbol}-${currencyB.symbol}`]?.volumeUSD
			}`
		);

	const apr =
		pairInfo?.oneDay?.[`${currencyA.symbol}-${currencyB.symbol}`] &&
		pairInfo?.general?.[`${currencyA.symbol}-${currencyB.symbol}`] &&
		formattedPercent(
			`${currentDayVolume}`,
			`${
				Number(
					pairInfo.general?.[`${currencyA.symbol}-${currencyB.symbol}`]
						?.trackedReserveSYS
				) * sysPrice
			}`
		);

	const showPool =
		currentNetworkChainId === 2814
			? ""
			: pairInfo?.oneDay?.[`${currencyA.symbol}-${currencyB.symbol}`] &&
			  userTokensBalance.map(item => item.symbol).includes(currencyA.symbol) &&
			  userTokensBalance.map(item => item.symbol).includes(currencyB.symbol)
			? ""
			: "none";

	useMemo(() => {
		if (pairInfo?.oneDay?.[`${currencyA.symbol}-${currencyB.symbol}`]) {
			setPoolsApr(prevState => {
				const value = parseFloat(
					(
						(Number(currentDayVolume) * 0.003 * 365 * 100) /
						(Number(
							pairInfo?.general?.[`${currencyA.symbol}-${currencyB.symbol}`]
								?.trackedReserveSYS
						) *
							sysPrice)
					).toString()
				);

				return {
					...prevState,
					[`${currencyA.symbol}-${currencyB.symbol}`]: value,
				};
			});
			setPoolsWithLiquidity(prevState => ({
				...prevState,
				[`${currencyA.symbol}-${currencyB.symbol}`]: +poolBalance,
			}));
			setPoolsLiquidity(prevState => ({
				...prevState,
				[`${currencyA.symbol}-${currencyB.symbol}`]:
					Number(
						pairInfo.general?.[`${currencyA.symbol}-${currencyB.symbol}`]
							?.trackedReserveSYS
					) * sysPrice,
			}));
			setPoolsVolume(prevState => ({
				...prevState,
				[`${currencyA.symbol}-${currencyB.symbol}`]:
					Number(
						pairInfo.general?.[`${currencyA.symbol}-${currencyB.symbol}`]
							?.volumeUSD
					) -
					Number(
						pairInfo.oneDay?.[`${currencyA.symbol}-${currencyB.symbol}`]
							?.volumeUSD
					),
			}));
		}
	}, [sysPrice, poolBalance]);

	return (
		<Flex
			flexDirection="column"
			p="6"
			w="xs"
			borderRadius="xl"
			border="1px solid rgb(86,190,216, 0.4)"
			background={theme.bg.blackAlpha}
			display={showPool}
		>
			<Flex gap="7">
				<Flex position="relative">
					<Img src={wrapTokenA?.logoURI} w="6" h="6" />
					<Img
						src={wrapTokenB?.logoURI}
						w="6"
						h="6"
						position="absolute"
						left="1.3rem"
					/>
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
						Volume (24h)
					</Text>
					<Text>{volumeUSD || "-"}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold" color={theme.text.mono}>
						APR
					</Text>
					<Text>{apr || "0%"}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text
						fontWeight="semibold"
						color={percentShare === 0 ? theme.text.lightnessGray : ""}
					>
						Your pool share
					</Text>
					<Text color={percentShare === 0 ? theme.text.lightnessGray : ""}>
						{percentShare !== 0 && percentShare
							? percentShare > 0 && percentShare < 1
								? "<0.01%"
								: `${percentShare}%`
							: "-"}
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
