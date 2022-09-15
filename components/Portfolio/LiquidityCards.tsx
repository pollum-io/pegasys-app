import { Flex, useColorMode, Text, Image, Button } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { usePicasso } from "hooks";
import { liquidityCardsMockedData } from "helpers/mockedData";
import { usePaginator } from "chakra-paginator";
import { ILiquidityCardsMockedData } from "types";
import { PaginationComponent } from "./Pagination";

export const LiquidityCards: React.FunctionComponent = () => {
	const theme = usePicasso();
	const { colorMode } = useColorMode();

	const quantityPerPage = 1;

	const quantityOfPages = Math.ceil(
		liquidityCardsMockedData.length / quantityPerPage
	);

	const [cardsSliced, setCardsSliced] = useState<ILiquidityCardsMockedData[]>(
		[]
	);

	const { currentPage, setCurrentPage } = usePaginator({
		initialState: { currentPage: 1 },
	});

	const handlePaginate = (
		// type component 1 || type component 2 || type component 3
		arrayValue:
			| ILiquidityCardsMockedData[]
			| ILiquidityCardsMockedData[]
			| ILiquidityCardsMockedData[],
		pageSize: number,
		currentPage: number,
		setCardsSliced: React.Dispatch<
			React.SetStateAction<
				| ILiquidityCardsMockedData[]
				| ILiquidityCardsMockedData[]
				| ILiquidityCardsMockedData[]
			>
		>
	) => {
		const sliced = arrayValue.slice(
			(currentPage - 1) * pageSize,
			currentPage * pageSize
		);

		setCardsSliced(sliced);

		return sliced;
	};

	useMemo(() => {
		handlePaginate(
			liquidityCardsMockedData,
			quantityPerPage,
			currentPage,
			setCardsSliced
		);
	}, [currentPage, liquidityCardsMockedData]);

	return (
		// eslint-disable-next-line
		<>
			{cardsSliced?.map(cardsValue => (
				<Flex
					key={cardsValue.id}
					flexDirection={["column", "column", "row", "row"]}
					justifyContent="center"
					w="100%"
					px={["1.5rem", "2rem", "2.5rem", "8rem"]}
				>
					<Flex
						display={["flex", "none", "none", "none"]}
						bgColor="rgba(255, 255, 255, 0.16)"
						borderTopRadius="12px"
						w="max-content"
						h="max-content"
						py="1"
						px="2"
						fontSize="12px"
						fontWeight="normal"
					>
						Pool Share {cardsValue.poolShare}
					</Flex>

					<Flex
						zIndex="base"
						gap={["2", "2", "0", "0"]}
						flexDirection={["column", "column", "row", "row"]}
						w="100%"
						background={
							colorMode === "light"
								? `linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(350.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 100%) border-box`
								: theme.bg.blackAlpha
						}
						pl={["4", "6", "6", "6"]}
						pr={["4", "6", "0", "0"]}
						py={["4", "3", "3", "3"]}
						border="1px solid transparent"
						borderRadius="0.75rem"
						mb="2"
					>
						<Flex
							flexDirection="row"
							alignItems={["flex-top", "flex-top", "center", "center"]}
							justifyContent="space-between"
							color={theme.text.mono}
							w={["100%", "100%", "", "90%"]}
						>
							<Flex
								gap={["1", "2", "0", "0"]}
								alignItems={["flex-start", "flex-start", "center", "center"]}
								w={["75%", "53%", "30.2%", "29.2%"]}
								h="100%"
								flexDirection={["column", "column", "row", "row"]}
							>
								{}

								<Flex
									flexDirection={["row", "row", "row", "row"]}
									alignItems={["flex-start", "flex-start", "center", "center"]}
									gap={["3", "3", "2", "2"]}
								>
									<Flex>
										<Image src={cardsValue.firstIcon} h="2.76rem" w="2.76rem" />
										<Image
											src={cardsValue.secondIcon}
											h="2.76rem"
											w="2.76rem"
										/>
									</Flex>
									<Flex
										flexDirection={["column", "column", "row", "row"]}
										h={["2.76rem", "", "", ""]}
										justifyContent={[
											"space-between",
											"normal",
											"normal",
											"normal",
										]}
										alignItems={["normal", "normal", "center", "center"]}
									>
										<Text
											fontWeight="bold"
											fontSize={["14px", "16px", "14px", "14px"]}
										>
											{cardsValue.firstAsset} / {cardsValue.secondAsset}
										</Text>
										<Text
											fontSize={["12px", "14px", "0", "0"]}
											display={["flex", "flex", "none", "none"]}
										>
											Value {cardsValue.value}
										</Text>
									</Flex>
								</Flex>
								<Flex
									flexDirection="column"
									fontSize={["12px", "12px", "14px", "14px"]}
									display={["flex", "flex", "none", "none"]}
									pt="2"
								>
									<Flex
										flexDirection={["column", "column", "column", "column"]}
										w="max-content"
									>
										<Text
											fontWeight="bold"
											fontSize={["14px", "16px", "14px", "14px"]}
										>
											Pooled Tokens
										</Text>
										<Flex flexDirection="row" gap="2">
											<Text fontSize={["12px", "14px", "14px", "14px"]}>
												{cardsValue.firstAsset}: {cardsValue.firstPooledTokens}
											</Text>
											<Text fontSize={["12px", "14px", "14px", "14px"]}>
												{cardsValue.secondAsset}:{" "}
												{cardsValue.secondPooledTokens}
											</Text>
										</Flex>
									</Flex>
								</Flex>
							</Flex>
							<Flex
								flexDirection={["column", "row", "row", "row"]}
								alignContent={["flex-end", "flex-start", "normal", "normal"]}
								alignItems={["flex-end", "center", "center", "center"]}
								w={["20%", "45%", "68%", "73.2%"]}
								justifyContent={[
									"flex-end",
									"space-between",
									"space-between",
									"space-between",
								]}
								h="100%"
								pr={["0", "0", "0.7rem", "2.2rem"]}
							>
								<Flex
									flexDirection="column"
									fontSize={["12px", "12px", "14px", "14px"]}
									display={["none", "none", "flex", "flex"]}
								>
									<Flex
										flexDirection={["column", "row", "column", "column"]}
										gap={["2", "3", "0", "0"]}
										w={["", "18rem", "9rem", "9rem"]}
									>
										<Text fontSize={["12px", "12px", "14px", "14px"]}>
											{cardsValue.firstAsset}: {cardsValue.firstPooledTokens}
										</Text>
										<Text fontSize={["12px", "12px", "14px", "14px"]}>
											{cardsValue.secondAsset}: {cardsValue.secondPooledTokens}
										</Text>
									</Flex>
								</Flex>
								<Flex
									justifyContent="flex-start"
									w="6rem"
									display={["none", "none", "flex", "flex"]}
								>
									<Text fontSize="14px">{cardsValue.value}</Text>
								</Flex>
								<Flex
									justifyContent="flex-start"
									fontSize={["14px", "16px", "14px", "14px"]}
									flexDirection={["column", "column", "row", "row"]}
									w="3rem"
									alignItems={["flex-end", "normal", "normal", "normal"]}
									color={[
										theme.text.cyanPurple,
										theme.text.cyanPurple,
										theme.text.mono,
										theme.text.mono,
									]}
								>
									<Text>{cardsValue.apr}</Text>
									<Text
										display={["flex", "flex", "none", "none"]}
										fontSize={["14px", "16px", "14px", "14px"]}
									>
										APR
									</Text>
								</Flex>
								<Flex
									alignItems={["flex-end", "flex-end", "normal", "normal"]}
									justifyContent="flex-start"
									flexDirection="column"
									w={["", "50%", "5rem", "5rem"]}
								>
									<Text
										display={["none", "flex", "none", "none"]}
										fontSize="16px"
										order={[0, 1, 0, 0]}
									>
										Pool Share
									</Text>

									<Text
										fontSize={["12px", "14px", "14px", "14px"]}
										display={["none", "flex", "flex", "flex"]}
									>
										{cardsValue.poolShare}
									</Text>
								</Flex>
							</Flex>
						</Flex>
						<Flex
							gap={["3", "3", "2", "2"]}
							mt={["", "0.5rem", "0", "0"]}
							justifyContent={["center", "center", "normal", "normal"]}
							flexDirection={["row", "row", "column", "column"]}
							alignItems="center"
							w={["100%", "100%", "15%", "10%"]}
							px={["", "4rem", "0", "0"]}
						>
							<Button
								justifyContent="center"
								w={["55%", "60%", "80%", "80%"]}
								h="max-content"
								py={["1", "0.3rem", "1", "1"]}
								px="10%"
								border="1px solid"
								borderRadius="67px"
								bgColor="transparent"
								borderColor={theme.text.cyanPurple}
								color={theme.text.whitePurple}
								fontSize="xs"
								fontWeight="semibold"
								_hover={{
									borderColor: theme.text.cyanLightPurple,
									color: theme.text.cyanLightPurple,
								}}
							>
								Remove
							</Button>
							<Button
								w={["55%", "60%", "80%", "80%"]}
								h="max-content"
								py={["1", "0.3rem", "1", "1"]}
								px="10%"
								border="1px solid transparent"
								borderRadius="67px"
								bgColor={theme.bg.blueNavyLightness}
								color={theme.text.cyan}
								fontSize="xs"
								fontWeight="semibold"
								_hover={{
									bgColor: theme.bg.bluePurple,
								}}
							>
								Add
							</Button>
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
