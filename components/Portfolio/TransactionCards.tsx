import { Flex, useColorMode, Text } from "@chakra-ui/react";
import { FunctionComponent, useMemo, useState } from "react";
import { usePicasso } from "hooks";
import { usePaginator } from "chakra-paginator";
import {
	ILiquidityCardsMockedData,
	ITransactionCardsMockedData,
	IWalletStatsCardsMockedData,
} from "types";
import { transactionCardsMockedData } from "helpers/mockedData";
import { handlePaginate } from "./HandlePaginate";
import { PaginationComponent } from "./Pagination";

export const TransactionCards: FunctionComponent = () => {
	const theme = usePicasso();
	const { colorMode } = useColorMode();

	const quantityPerPage = 5;

	const quantityOfPages = Math.ceil(
		transactionCardsMockedData.length / quantityPerPage
	);

	const [cardsSliced, setCardsSliced] = useState<ITransactionCardsMockedData[]>(
		[]
	);

	const { currentPage, setCurrentPage } = usePaginator({
		initialState: { currentPage: 1 },
	});

	useMemo(() => {
		handlePaginate(
			transactionCardsMockedData,
			quantityPerPage,
			currentPage,
			setCardsSliced as React.Dispatch<
				React.SetStateAction<
					| ILiquidityCardsMockedData[]
					| IWalletStatsCardsMockedData[]
					| ITransactionCardsMockedData[]
				>
			>
		);
	}, [currentPage, transactionCardsMockedData]);

	return (
		// eslint-disable-next-line
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
										fontSize="14px"
										color={theme.text.cyanPurple}
									>
										{cardsValue.type}
									</Text>
									<Flex display={["flex", "flex", "none", "none"]}>
										<Text fontSize="14px" fontStyle="italic">
											{cardsValue.time}
										</Text>
									</Flex>
								</Flex>
							</Flex>
							<Flex
								flexDirection={["column", "row", "row", "row"]}
								alignItems={["flex-end", "flex-start", "center", "center"]}
								w={["32%", "55%", "72%", "100%"]}
								justifyContent="space-between"
								h="100%"
							>
								<Flex
									flexDirection="column"
									display={["none", "flex", "none", "none"]}
								>
									<Flex w="8rem">
										<Text fontSize="14px">{cardsValue.totalAmount}</Text>
									</Flex>
									<Flex w="8rem">
										<Text fontSize="14px">{cardsValue.tokenAmount}</Text>
									</Flex>
								</Flex>
								<Flex
									w="5rem"
									justifyContent={[
										"flex-end",
										"flex-end",
										"flex-start",
										"flex-start",
									]}
								>
									<Text fontSize="14px" order={[0, 1, 0, 0]} flexWrap="wrap">
										{cardsValue.totalValue}
									</Text>
								</Flex>
								<Flex w="8rem" display={["none", "none", "flex", "flex"]}>
									<Text
										order={[1, 0, 0, 0]}
										fontSize={["12px", "14px", "14px", "14px"]}
									>
										{cardsValue.totalAmount}
									</Text>
								</Flex>
								<Flex w="8rem" display={["none", "none", "flex", "flex"]}>
									<Text fontSize={["12px", "14px", "14px", "14px"]}>
										{cardsValue.tokenAmount}
									</Text>
								</Flex>
								<Flex w="6rem" display={["none", "none", "flex", "flex"]}>
									<Text fontSize="14">{cardsValue.time}</Text>
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
