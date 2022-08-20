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
import { Trade } from "@pollum-io/pegasys-sdk";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
	selectedTokens: WrappedTokenInfo[];
	txType: string;
	onTx: (() => Promise<string>) | (() => Promise<void>) | null | undefined;
	trade: Trade | undefined;
	isWrap: boolean;
	tokenInputValue: ISwapTokenInputValue;
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
	} = props;
	const theme = usePicasso();

	const txName =
		txType === "approve"
			? "Approve"
			: txType === "swap"
			? "Swap"
			: txType === "wrap" && isWrap
			? "Wrap"
			: txType === "wrap" && !isWrap
			? "Unwrap"
			: txType === "approve"
			? "Approve"
			: "Swap";

	const receiveEstimatedValue = !isWrap
		? trade?.outputAmount.toSignificant(4)
		: tokenInputValue?.inputTo?.value;

	const receiveOutput = !isWrap
		? trade?.outputAmount?.currency.symbol
		: selectedTokens[1]?.symbol;
	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				borderRadius="3xl"
				border="1px solid transparent;"
				background={`linear-gradient(${theme.bg.blueNavy}, ${theme.bg.blueNavy}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
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
					<Flex flexDirection="column" alignItems="center" mb="6">
						<Flex flexDirection="row" gap="2">
							<Text>{tokenInputValue?.inputFrom?.value}</Text>
							<Img src={selectedTokens[0]?.logoURI} w="5" h="5" />
							<Text>{selectedTokens[0]?.symbol}</Text>
						</Flex>
						<Icon
							as={MdArrowDownward}
							bg="transparent"
							color={theme.text.cyanPurple}
							w="6"
							h="6"
							borderRadius="full"
						/>
						<Flex flexDirection="row" gap="2">
							<Text>{tokenInputValue?.inputTo?.value}</Text>
							<Img src={selectedTokens[1]?.logoURI} w="5" h="5" />
							<Text>{selectedTokens[1]?.symbol}</Text>
						</Flex>
					</Flex>
					<Text fontSize="sm">
						Output is estimated. You will receive at least{" "}
						{receiveEstimatedValue} {receiveOutput} or the transaction will
						revert.
					</Text>
				</ModalBody>
				<Flex
					bgColor={theme.bg.blackLightness}
					borderBottomRadius="3xl"
					flexDirection="column"
					p="1.5rem"
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
								{trade
									? `${trade?.outputAmount.toSignificant(4)} ${
											trade?.outputAmount?.currency.symbol
									  }`
									: "-"}
							</Text>
						</Flex>
						<Flex flexDirection="row" justifyContent="space-between">
							<Text>Price Impact</Text>
							<Text fontWeight="medium">
								{trade ? `${trade?.priceImpact?.toSignificant(4)}%` : "-"}
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
							bgColor={theme.bg.button.connectWalletSwap}
							color={theme.text.cyanWhite}
							fontSize="lg"
							onClick={() => {
								onTx();
								onClose();
							}}
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
