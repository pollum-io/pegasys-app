import {
	Button,
	Flex,
	Icon,
	Modal,
	ModalContent,
	ModalHeader,
	Img,
	ModalOverlay,
	Text,
	ModalBody,
	useColorMode,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import React from "react";
import { MdArrowDownward, MdOutlineClose } from "react-icons/md";
import { WrappedTokenInfo, ISwapTokenInputValue } from "types";
import { CurrencyAmount, Trade } from "@pollum-io/pegasys-sdk";
import { FormattedPriceImpat } from "components/Swap/FormattedPriceImpact";
import { useTranslation } from "react-i18next";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
	selectedTokens: WrappedTokenInfo[];
	txType: string;
	onTx: (() => Promise<string>) | (() => Promise<void>) | null | undefined;
	trade: Trade | undefined;
	isWrap: boolean;
	tokenInputValue: ISwapTokenInputValue;
	minimumReceived: string | 0 | null | undefined;
	liquidityFee?: CurrencyAmount;
	openPendingTx: () => void;
}

export const ConfirmSwap: React.FC<IModal> = props => {
	const {
		onClose,
		isOpen,
		selectedTokens,
		txType,
		onTx,
		trade,
		isWrap,
		tokenInputValue,
		liquidityFee,
		minimumReceived,
		openPendingTx,
	} = props;
	const theme = usePicasso();

	const { t: translation, i18n } = useTranslation();

	const { colorMode } = useColorMode();

	const txName =
		txType === "approve"
			? "Approve"
			: txType === "swap" || txType === "approve-swap"
			? "Swap"
			: txType === "wrap" && isWrap
			? "Wrap"
			: txType === "wrap" && !isWrap
			? "Unwrap"
			: txType === "approve"
			? "Approve"
			: "Swap";

	const { language } = i18n;

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				position={["absolute", "relative", "relative", "relative"]}
				mt={["0", "6rem", "6rem", "6rem"]}
				mb={["0", "unset", "unset", "unset"]}
				bottom={["0", "unset", "unset", "unset"]}
				borderRadius="30px"
				borderBottomRadius={["0", "30px", "30px", "30px"]}
				boxShadow={
					colorMode === "dark"
						? "0px 0px 0px 1px rgba(0, 0, 0, 0.1)"
						: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
				}
				filter={
					colorMode === "dark"
						? "drop-shadow(0px 5px 10px rgba(0, 0, 0, 0.2)) drop-shadow(0px 15px 40px rgba(0, 0, 0, 0.4))"
						: "none"
				}
				borderTop={
					colorMode === "dark"
						? ["1px solid transparent", "none", "none", "none"]
						: ["none", "none", "none", "none"]
				}
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(270.16deg, rgba(24,54,61, 0.8) 90.76%, rgba(24,54,61, 0) 97.76%) border-box`}
			>
				<ModalHeader
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					p="1.5rem"
				>
					<Flex alignItems="center">
						<Text fontSize="lg" fontWeight="medium" textAlign="center">
							{translation("settings.confirm")} {txName}
						</Text>
					</Flex>
					<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
						<MdOutlineClose
							size={22}
							onClick={onClose}
							color={theme.text.mono}
						/>
					</Flex>
				</ModalHeader>
				<ModalBody mb="4">
					<Flex
						flexDirection="column"
						alignItems="center"
						mb="6"
						justifyContent="center"
					>
						<Flex w="100%" justifyContent="center" gap="2">
							<Text textAlign="right" fontWeight="semibold">
								{tokenInputValue?.inputFrom?.value}
							</Text>
							<Img src={selectedTokens[0]?.logoURI} w="5" h="5" />
							<Text>{selectedTokens[0]?.symbol}</Text>
						</Flex>
						<Flex w="100%" justifyContent="center" my="0.8rem">
							<Icon
								as={MdArrowDownward}
								bg="transparent"
								color={theme.text.cyanPurple}
								w="6"
								h="6"
								borderRadius="full"
							/>
						</Flex>
						<Flex w="100%" justifyContent="center" gap="2">
							<Text fontWeight="semibold">
								{tokenInputValue?.inputTo?.value}
							</Text>
							<Img src={selectedTokens[1]?.logoURI} w="5" h="5" />
							<Text>{selectedTokens[1]?.symbol}</Text>
						</Flex>
					</Flex>
					<Text fontSize="sm" color={theme.text.mono} textAlign="justify">
						{translation("swap.outputEstimated")} {minimumReceived}{" "}
						{translation("swap.transactionRevert")}
					</Text>
				</ModalBody>
				<Flex
					bgColor={theme.bg.blackLightness}
					borderBottomRadius={["0", "30px", "30px", "30px"]}
					flexDirection="column"
					p="1.5rem"
					pb={["3.75rem", "1.5rem", "1.5rem", "1.5rem"]}
					w="100%"
				>
					<Flex
						flexDirection="column"
						gap="2"
						fontSize={["0.875rem", "1rem", "1rem", "1rem"]}
					>
						<Flex flexDirection="row" justifyContent="space-between">
							<Text>{translation("swapPage.price")}</Text>
							<Text fontWeight="medium">
								{trade ? trade?.executionPrice?.toSignificant(6) : "-"}{" "}
								{selectedTokens[0]?.symbol}/{selectedTokens[1]?.symbol}
							</Text>
						</Flex>
						<Flex flexDirection="row" justifyContent="space-between">
							<Text w={["10rem", "max-content", "max-content", "max-content"]}>
								{translation("swap.minimumReceived")}
							</Text>
							<Text fontWeight="medium">
								{minimumReceived && minimumReceived}{" "}
								{trade && trade?.outputAmount?.currency.symbol}
							</Text>
						</Flex>
						<Flex flexDirection="row" justifyContent="space-between">
							<Text>{translation("swap.priceImpact")}</Text>
							<Text fontWeight="medium">
								{trade ? (
									<FormattedPriceImpat priceImpact={trade?.priceImpact} />
								) : (
									"-"
								)}
							</Text>
						</Flex>
						<Flex
							flexDirection="row"
							justifyContent="space-between"
							alignItems="center"
						>
							<Text
								w={
									language === "fr" || language === "vn"
										? ["10rem", "12rem", "max-content", "max-content"]
										: ["10rem", "max-content", "max-content", "max-content"]
								}
							>
								{translation("swap.liquidityProviderFee")}
							</Text>
							<Text fontWeight="medium">
								{liquidityFee && liquidityFee?.toSignificant(4)}{" "}
								{trade && trade?.inputAmount?.currency?.symbol}
							</Text>
						</Flex>
					</Flex>
					<Flex>
						<Button
							w="100%"
							mt="1.5rem"
							py={["0.5rem", "6", "6", "6"]}
							borderRadius="67px"
							bgColor={theme.bg.blueNavyLightness}
							color={theme.text.cyan}
							fontSize={["1rem", "lg", "lg", "lg"]}
							onClick={() => {
								if (!onTx) return;
								openPendingTx();
								onTx();
								onClose();
							}}
							_hover={{ bgColor: theme.bg.bluePurple }}
							fontWeight="semibold"
						>
							{translation("settings.confirm")} {txName}
						</Button>
					</Flex>
				</Flex>
			</ModalContent>
		</Modal>
	);
};
