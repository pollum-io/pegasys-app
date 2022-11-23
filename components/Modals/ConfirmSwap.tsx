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
				position={["absolute", "absolute", "relative", "relative"]}
				m={["0", "0", "10", "10"]}
				bottom={["0", "0", "unset", "unset"]}
				borderRadius="3xl"
				borderBottomRadius={["0", "0", "3xl", "3xl"]}
				border={["none", "1px solid transparent"]}
				borderTop="1px solid transparent"
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
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
					borderBottomRadius={["0", "0", "3xl", "3xl"]}
					flexDirection="column"
					p="1.5rem"
					pb={["3.75rem", "3.75rem", "1.5rem", "1.5rem"]}
				>
					<Flex
						flexDirection="column"
						gap="2"
						fontSize={["14px", "16px", "16px", "16px"]}
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
							py="6"
							px="6"
							borderRadius="67px"
							bgColor={theme.bg.blueNavyLightness}
							color={theme.text.cyan}
							fontSize="lg"
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
