import { Button, Flex, Img, Text } from "@chakra-ui/react";
import { FunctionComponent, SetStateAction, useMemo, useState } from "react";
import { useModal, usePicasso, useWallet } from "hooks";
import { getBalanceOfSingleCall, getTotalSupply, unwrappedToken } from "utils";
import {
	JSBI,
	Pair,
	Percent,
	Token,
	TokenAmount,
} from "@pollum-io/pegasys-sdk";
import { WrappedTokenInfo } from "types";
import { Signer } from "ethers";

interface IPoolCards {
	poolVolume?: string;
	poolApr?: string;
	setIsCreate: React.Dispatch<SetStateAction<boolean>>;
	pair?: Pair;
	userTokens?: WrappedTokenInfo[];
	setSelectedToken: React.Dispatch<React.SetStateAction<WrappedTokenInfo[]>>;
	setCurrPair: React.Dispatch<React.SetStateAction<Pair | undefined>>;
	setSliderValue: React.Dispatch<SetStateAction<number>>;
}

interface IDeposited {
	token0: TokenAmount | undefined;
	token1: TokenAmount | undefined;
}

export const PoolCards: FunctionComponent<IPoolCards> = props => {
	const {
		poolVolume,
		poolApr,
		setIsCreate,
		pair,
		userTokens,
		setSelectedToken,
		setCurrPair,
		setSliderValue,
	} = props;
	const theme = usePicasso();
	const { onOpenRemoveLiquidity, onOpenAddLiquidity } = useModal();
	const { setCurrentLpAddress, signer, walletAddress } = useWallet();
	const [poolPercentShare, setPoolPercentShare] = useState<string>("");
	const [depositedTokens, setDepositedTokens] = useState<IDeposited>();
	const [userPoolBalance, setUserPoolBalance] = useState<string>("");

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
			setCurrPair(pair);
			setSliderValue(0);
			return;
		}
		setIsCreate(false);
		onOpenAddLiquidity();
		setCurrentLpAddress(`${pair?.liquidityToken.address}`);
		setSelectedToken([wrapTokenA, wrapTokenB]);
	};

	useMemo(async () => {
		const pairBalance = await getBalanceOfSingleCall(
			pair?.liquidityToken.address as string,
			walletAddress,
			signer,
			6
		);

		const value = JSBI.BigInt(Math.floor(Number(pairBalance)));

		const pairBalanceAmount = new TokenAmount(
			pair?.liquidityToken as Token,
			value
		);

		const totalSupply = await getTotalSupply(
			pair?.liquidityToken as Token,
			signer as Signer
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
		const amount =
			`${+pairBalanceAmount.toSignificant(6) * 10 ** 6}`.length >= 9
				? `${+pairBalanceAmount.toSignificant(6) * 10 ** 6}`
				: `${(+pairBalanceAmount.toSignificant(6) * 10 ** 6).toFixed(2)}`;

		setPoolPercentShare(
			(Number(poolTokenPercentage?.toSignificant(6)) * 10 ** 6).toFixed(2)
		);
		setDepositedTokens({ token0: token0Deposited, token1: token1Deposited });
		setUserPoolBalance(amount);
	}, [pair]);

	return (
		<Flex
			flexDirection="column"
			p="6"
			w="xs"
			borderRadius="xl"
			border="1px solid rgb(86,190,216, 0.4)"
			background={theme.bg.blackAlpha}
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
					<Text>{userPoolBalance || "-"}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold" color={theme.text.mono}>
						Volume
					</Text>
					<Text>{poolVolume}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold" color={theme.text.mono}>
						APR
					</Text>
					<Text>{poolApr}</Text>
				</Flex>
				<Flex justifyContent="space-between" pb="3" fontSize="sm">
					<Text fontWeight="semibold" color={theme.text.mono}>
						Your pool share
					</Text>
					<Text>{poolPercentShare ? `${poolPercentShare}%` : "-"}</Text>
				</Flex>
			</Flex>
			<Flex gap="2" mt="1.5rem">
				<Button
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
