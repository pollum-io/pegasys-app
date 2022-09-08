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
import { MdArrowDownward } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { WrappedTokenInfo, ISwapTokenInputValue } from "types";
import { CurrencyAmount, Trade } from "@pollum-io/pegasys-sdk";
import { FormattedPriceImpat } from "components/Swap/FormattedPriceImpact";

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
	} = props;
	const theme = usePicasso();

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
							Confirm {txName}
						</Text>
					</Flex>
					<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
						<AiOutlineClose size={24} />
					</Flex>
				</ModalHeader>
				<ModalBody mb="4">
					<Flex
						flexDirection="row"
						alignItems="center"
						mb="6"
						justifyContent="center"
						pr="4rem"
					>
						<Flex flexDirection="column" gap="14" pr="2">
							<Text textAlign="right" fontWeight="semibold">
								{tokenInputValue?.inputFrom?.value}
							</Text>
							<Text textAlign="right" fontWeight="semibold">
								{tokenInputValue?.inputTo?.value}
							</Text>
						</Flex>
						<Flex flexDirection="column" gap="1.1rem" alignItems="center">
							<Img src={selectedTokens[0]?.logoURI} w="5" h="5" />
							<Icon
								as={MdArrowDownward}
								bg="transparent"
								color={theme.text.cyanPurple}
								w="6"
								h="6"
								borderRadius="full"
							/>
							<Img src={selectedTokens[1]?.logoURI} w="5" h="5" />
						</Flex>

						<Flex
							flexDirection="column"
							gap="14"
							pl="2"
							alignItems="flex-start"
						>
							<Text>{selectedTokens[0]?.symbol}</Text>
							<Text>{selectedTokens[1]?.symbol}</Text>
						</Flex>
					</Flex>
					<Text fontSize="sm" color={theme.text.mono}>
						Output is estimated. You will receive at least {minimumReceived} or
						the transaction will revert.
					</Text>
				</ModalBody>
				<Flex
					bgColor={theme.bg.blackLightness}
					borderBottomRadius={["0", "0", "3xl", "3xl"]}
					flexDirection="column"
					p="1.5rem"
					pb={["3.75rem", "3.75rem", "1.5rem", "1.5rem"]}
				>
					<Flex flexDirection="column" gap="2">
						<Flex flexDirection="row" justifyContent="space-between">
							<Text>Price</Text>
							<Text fontWeight="medium">
								{trade ? trade?.executionPrice?.toSignificant(6) : "-"}{" "}
								{selectedTokens[0]?.symbol}/{selectedTokens[1]?.symbol}
							</Text>
						</Flex>
						<Flex flexDirection="row" justifyContent="space-between">
							<Text>Minmum Received</Text>
							<Text fontWeight="medium">
								{minimumReceived && minimumReceived}{" "}
								{trade && trade?.outputAmount?.currency.symbol}
							</Text>
						</Flex>
						<Flex flexDirection="row" justifyContent="space-between">
							<Text>Price Impact</Text>
							<Text fontWeight="medium">
								{trade ? (
									<FormattedPriceImpat priceImpact={trade?.priceImpact} />
								) : (
									"-"
								)}
							</Text>
						</Flex>
						<Flex flexDirection="row" justifyContent="space-between">
							<Text>Liquidity Provider Fee</Text>
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
								onTx();
								onClose();
							}}
							_hover={{ bgColor: theme.bg.bluePurple }}
							fontWeight="semibold"
						>
							Confirm {txName}
						</Button>
					</Flex>
				</Flex>
			</ModalContent>
		</Modal>
	);
};
