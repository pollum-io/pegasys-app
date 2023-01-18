import { Flex, useColorMode, Text } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { usePicasso } from "hooks";
import { usePaginator } from "chakra-paginator";
import { usePortfolio } from "hooks/usePortfolio";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import moment from "moment";
import { ITransactions } from "pegasys-services/dto/contexts/portfolio";
import { handlePaginate } from "./HandlePaginate";
import { PaginationComponent } from "./Pagination";

interface ITransactionCard {
	buttonOption: string;
}

export const TransactionCards: FunctionComponent<ITransactionCard> = props => {
	const { buttonOption } = props;
	const theme = usePicasso();
	const { colorMode } = useColorMode();
	const {
		swapsTransactions,
		burnsTransactions,
		mintsTransactions,
		allTransactions,
	} = usePortfolio();
	const { t: translation } = useTranslation();

	const showTransactions = useMemo(() => {
		if (buttonOption === "all") return allTransactions;
		if (buttonOption === "swaps") return swapsTransactions;
		if (buttonOption === "removes") return burnsTransactions;
		return mintsTransactions;
	}, [buttonOption, swapsTransactions, burnsTransactions, mintsTransactions]);

	const quantityPerPage = 5;

	const quantityOfPages = Math.ceil(showTransactions.length / quantityPerPage);

	const [cardsSliced, setCardsSliced] = useState<ITransactions[]>([]);

	const { currentPage, setCurrentPage } = usePaginator({
		initialState: { currentPage: 1 },
	});

	const date = (timestamp: number) => {
		const newData = moment.unix(timestamp).fromNow();
		return newData;
	};

	useMemo(() => {
		handlePaginate(
			showTransactions,
			quantityPerPage,
			currentPage,
			setCardsSliced as any
		);
	}, [
		currentPage,
		showTransactions,
		swapsTransactions,
		burnsTransactions,
		mintsTransactions,
	]);

	useEffect(() => {
		setCurrentPage(1);
	}, [showTransactions]);

	return (
		<>
			{cardsSliced?.map(cardsValue => (
				<Flex
					key={cardsValue.id}
					justifyContent="center"
					w="100%"
					px={["1.5rem", "2rem", "2.5rem", "8rem"]}
				>
					<Flex
						w="100%"
						background={
							colorMode === "light"
								? `linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(350.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 100%) border-box`
								: theme.bg.blackAlpha
						}
						pl={["4", "4", "6", "6"]}
						py={["2.5", "3", "3", "3.5"]}
						pr={["4", "4", "4", "5"]}
						border="1px solid transparent"
						borderRadius="0.75rem"
						mb="2"
					>
						<Flex
							flexDirection="row"
							alignItems="center"
							justifyContent="space-between"
							color={theme.text.mono}
							w="100%"
						>
							<Flex
								gap="3"
								alignItems="center"
								w={["68%", "45%", "28%", "34.2%"]}
							>
								<Flex
									flexDirection={["column", "column", "row", "row"]}
									alignItems={["flex-start", "flex-start", "center", "center"]}
									justifyContent="space-between"
									w="100%"
								>
									<Text
										fontWeight="bold"
										fontSize="0.875rem"
										color={theme.text.cyanPurple}
									>
										{translation(
											`portfolioPage.${
												cardsValue.type === "swap"
													? "transactionNameSwaps"
													: cardsValue.type === "add"
													? "transactionNameMint"
													: "transactionNameBurn"
											}`,
											{
												symbol1: cardsValue.symbol0,
												symbol2: cardsValue.symbol1,
											}
										)}
									</Text>
									<Flex display={["flex", "flex", "none", "none"]}>
										<Text fontSize="0.875rem" fontStyle="italic">
											{date(cardsValue.time)}
										</Text>
									</Flex>
								</Flex>
							</Flex>
							<Flex
								flexDirection={["column", "row", "row", "row"]}
								alignItems={["flex-end", "flex-start", "center", "center"]}
								w={["32%", "55%", "72%", "100%"]}
								justifyContent={[
									"flex-end",
									"flex-end",
									"space-between",
									"space-between",
								]}
								h="100%"
							>
								<Flex
									w="5rem"
									justifyContent={[
										"flex-end",
										"flex-end",
										"flex-start",
										"flex-start",
									]}
								>
									<Text
										fontSize="0.875rem"
										order={[0, 1, 0, 0]}
										flexWrap="wrap"
									>
										${cardsValue.totalValue.toFixed(4)}
									</Text>
								</Flex>
								<Flex w="8rem" display={["none", "none", "flex", "flex"]}>
									<Text
										order={[1, 0, 0, 0]}
										fontSize={["0.75rem", "0.875rem", "0.875rem", "0.875rem"]}
									>
										{cardsValue.tokenAmount0}
									</Text>
								</Flex>
								<Flex w="8rem" display={["none", "none", "flex", "flex"]}>
									<Text
										fontSize={["0.75rem", "0.875rem", "0.875rem", "0.875rem"]}
									>
										{cardsValue.tokenAmount1}
									</Text>
								</Flex>
								<Flex w="6rem" display={["none", "none", "flex", "flex"]}>
									<Text fontSize="14">{date(cardsValue.time)}</Text>
								</Flex>
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
