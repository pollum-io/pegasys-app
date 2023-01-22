import { Flex, useColorMode, Text, Image } from "@chakra-ui/react";
import { FunctionComponent, useMemo, useState } from "react";
import { usePicasso, useTokens } from "hooks";
import {
	ILiquidityCardsMockedData,
	ITransactionCardsMockedData,
	IWalletStatsCardsMockedData,
	WrappedTokenInfo,
} from "types";
import { walletStatsCardsMockedData } from "helpers/mockedData";
import { usePaginator } from "chakra-paginator";
import { usePortfolio } from "hooks/usePortfolio";
import { handlePaginate } from "./HandlePaginate";
import { PaginationComponent } from "./Pagination";

export const WalletStatsCards: FunctionComponent = () => {
	const theme = usePicasso();
	const { colorMode } = useColorMode();
	const { userTokensBalance } = useTokens();
	const { walletBalance } = usePortfolio();
	const [defaultTokens, setDefaultTokens] = useState<WrappedTokenInfo[]>([]);
	const quantityPerPage = 2;
	const quantityOfPages = Math.ceil(walletBalance.length / quantityPerPage);

	const [cardsSliced, setCardsSliced] = useState<any[]>([]);

	const { currentPage, setCurrentPage } = usePaginator({
		initialState: { currentPage: 1 },
	});

	useMemo(() => {
		const orderedTokens = walletBalance
			.map((tokens: any, index: number) => {
				const obj = walletBalance[walletBalance.length - index - 1];

				return obj;
			})
			.sort(
				(valueA: { balance: string }, valueB: { balance: string }) =>
					Number(valueB.balance) - Number(valueA.balance)
			);
		console.log("dentro do memmo", orderedTokens);
		setDefaultTokens(orderedTokens);
	}, [walletBalance]);

	useMemo(() => {
		handlePaginate(
			defaultTokens,
			quantityPerPage,
			currentPage,
			setCardsSliced as React.Dispatch<React.SetStateAction<[]>>
		);
	}, [currentPage, defaultTokens]);

	console.log("cardsSliced", cardsSliced);

	return (
		// eslint-disable-next-line
		<>
			{cardsSliced?.map(cardsValue => (
				<Flex
					key={cardsValue?.id}
					justifyContent="center"
					w="100%"
					px={["1.5rem", "2rem", "2.5rem", "8rem"]}
					color={theme.text.mono}
				>
					<Flex
						w="100%"
						background={
							colorMode === "light"
								? `linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(350.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 100%) border-box`
								: theme.bg.blackAlpha
						}
						pl={["4", "4", "6", "6"]}
						py={["3", "3", "3", "3"]}
						border="1px solid transparent"
						borderRadius="0.75rem"
						mb="2"
					>
						<Flex
							gap="2.5"
							alignItems="center"
							w={["55%", "45%", "24%", "24%"]}
						>
							<Image
								src={cardsValue?.tokenImage}
								h="9"
								w="9"
								alt={cardsValue?.tokenImage}
							/>
							<Flex
								flexDirection={["column", "column", "row", "row"]}
								alignItems={["flex-start", "flex-start", "center", "center"]}
								justifyContent="space-between"
								w="100%"
							>
								<Text fontWeight="bold" fontSize="0.875rem">
									{cardsValue?.symbol}
								</Text>
								<Text
									fontSize={["0.75rem", "0.875rem", "0.875rem", "0.875rem"]}
									display={["flex", "flex", "none", "none"]}
								>
									{cardsValue?.priceUSD}
								</Text>
							</Flex>
						</Flex>
						<Flex
							flexDirection={["column", "row", "row", "row"]}
							alignItems={["flex-start", "center", "center", "center"]}
							justifyContent="space-between"
							w={["45%", "51%", "72%", "72%"]}
						>
							<Flex w="10rem" display={["none", "none", "flex", "flex"]}>
								<Text
									fontSize={["0.75rem", "0.875rem", "0.875rem", "0.875rem"]}
								>
									${cardsValue?.priceUSD.toFixed(2)}
								</Text>
							</Flex>

							<Flex
								w="6rem"
								order={[1, 0, 0, 0]}
								h={["100%", "max-content", "max-content", "max-content"]}
								mr="1.9rem"
							>
								<Text
									fontSize={["0.75rem", "0.875rem", "0.875rem", "0.875rem"]}
								>
									{Number(cardsValue?.balance).toFixed(10)}
								</Text>
							</Flex>
							<Flex w="6rem">
								<Text
									fontSize="14"
									fontWeight={["bold", "normal", "normal", "normal"]}
								>
									{Number(cardsValue?.value).toFixed(2)}
								</Text>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
			))}
			<PaginationComponent
				quantityOfPages={quantityOfPages}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
		</>
	);
};
