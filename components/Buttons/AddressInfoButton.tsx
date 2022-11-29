import {
	Button,
	Flex,
	Icon,
	Link,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useColorMode,
} from "@chakra-ui/react";
import {
	useToasty,
	useWallet,
	// ApprovalState,
	useTransaction,
} from "pegasys-services";
import { usePicasso } from "hooks";
import React, { FunctionComponent, useState, useEffect } from "react";
import Jazzicon from "react-jazzicon";
import {
	MdContentCopy,
	MdOutlineCallMade,
	MdOutlineClose,
} from "react-icons/md";
import { shortAddress, copyToClipboard, openWalletOnExplorer } from "utils";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { ITransactionResponse } from "types";
import { useTranslation } from "react-i18next";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

const TransactionRow: React.FC<{
	pending?: boolean;
	hash: string;
	summary: string;
	success?: boolean;
}> = ({ pending, hash, summary, success }) => {
	const { colorMode } = useColorMode();
	const { chainId } = useWallet();

	const explorerURL =
		chainId === 5700
			? "https://tanenbaum.io/tx"
			: chainId === 57
			? "https://explorer.syscoin.org/tx"
			: "https://explorer.testnet.rollux.com/tx";

	return (
		<Flex alignItems="center" justifyContent="flex-start" w="100%">
			{pending && (
				<Flex
					className="circleLoading"
					id={
						colorMode === "dark"
							? "pendingTransactionsDark"
							: "pendingTransactionsLight"
					}
				/>
			)}
			<Flex
				justifyContent="space-between"
				w="100%"
				alignItems="center"
				pl={pending ? "2" : "0"}
			>
				<Link
					fontSize="sm"
					href={`${explorerURL}/${hash}`}
					target="_blank"
					rel="noreferrer"
					alignItems="center"
				>
					{summary}
					<Icon
						as={MdOutlineCallMade}
						w="4"
						h="4"
						top="0.15rem"
						left="0.5rem"
						position="relative"
					/>
				</Link>
				{!pending && (
					<Flex>
						{success ? (
							<AiOutlineCheckCircle color="#25855A" />
						) : (
							<AiOutlineCloseCircle color="#E53E3E" />
						)}
					</Flex>
				)}
			</Flex>
		</Flex>
	);
};

export const AddressInfoButton: FunctionComponent<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const { colorMode } = useColorMode();
	const { pendingTxs, finishedTxs, clearAll } = useTransaction();
	const { toast } = useToasty();
	const { address, chainId, connectorSelected, disconnect } = useWallet();
	const { t: translation } = useTranslation();

	const handleCopyToClipboard = () => {
		copyToClipboard(address);

		toast({
			id: "toast1",
			position: "top-right",
			status: "success",
			title: translation("toasts.copied"),
			description: translation("toasts.addressCopied"),
		});
	};

	const explorerURL =
		chainId === 5700
			? "https://tanenbaum.io/tx"
			: chainId === 57
			? "https://explorer.syscoin.org/tx"
			: "https://explorer.testnet.rollux.com/tx";

	// useEffect(() => {
	// 	if (!isEmpty) {
	// 		// eslint-disable-next-line
	// 		const currentTxs: ITransactionResponse[] = [
	// 			...Object.values(transactions[5700]),
	// 			...Object.values(transactions[57]),
	// 			...Object.values(transactions[2814]),
	// 		];

	// 		setTxs(currentTxs);
	// 	}
	// }, [
	// 	transactions,
	// 	isEmpty,
	// 	transactions[57],
	// 	transactions[5700],
	// 	transactions[2814],
	// 	isPending,
	// ]);

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				my={["0", "40", "40", "40"]}
				top={["0", "0", "0", "0"]}
				h="max-content"
				position="absolute"
				mb={["0", "0", "none", "15rem"]}
				borderRadius="30px"
			>
				<ModalHeader
					bgColor={theme.bg.blueNavyLight}
					pt="1.5rem"
					pb="1rem"
					borderTopRadius="30px"
				>
					<Flex alignItems="center" justifyContent="space-between">
						<Text fontSize="lg" fontWeight="semibold">
							{translation("accountDetails.account")}
						</Text>
						<Flex _hover={{ cursor: "pointer" }}>
							<MdOutlineClose
								size={24}
								onClick={onClose}
								color={theme.icon.whiteDarkGray}
							/>
						</Flex>
					</Flex>
				</ModalHeader>
				<ModalBody bgColor={theme.bg.blueNavyLight} pb="6">
					<Flex
						borderRadius={18}
						bgColor={theme.bg.blackLightness}
						py="4"
						px="4"
						flexDirection="column"
					>
						<Flex
							justifyContent="space-between"
							flexDirection="row"
							align="center"
						>
							<Flex>
								<Text
									fontSize={["sm", "sm", "md", "md"]}
									fontWeight="semibold"
									color={theme.text.cyanPurple}
								>
									{translation("accountDetails.connectedWith")}{" "}
									{connectorSelected?.name}
								</Text>
							</Flex>
							<Flex>
								<Button
									borderRadius="full"
									border="1px solid"
									borderColor={theme.text.cyanPurple}
									px="2"
									py="0.5"
									w="max-content"
									h="max-content"
									color={theme.text.whitePurple}
									fontSize={["xs", "xs", "sm", "sm"]}
									fontWeight="bold"
									alignItems="center"
									bgColor="transparent"
									_hover={{
										borderColor: theme.text.cyanLightPurple,
										color: theme.text.cyanLightPurple,
									}}
									onClick={() => disconnect()}
								>
									{translation("accountDetails.disconnect")}
								</Button>
							</Flex>
						</Flex>
						<Flex
							mt="2"
							fontSize="md"
							fontWeight="semibold"
							textTransform="uppercase"
						>
							<Flex pr="2" alignItems="center">
								<Jazzicon diameter={15} seed={Number(address)} />
							</Flex>
							{address && shortAddress(address)}
						</Flex>
						<Flex flexDirection="row" mt="4">
							<Flex
								color={theme.text.gray}
								flexDirection="row"
								alignItems="center"
								cursor="pointer"
								onClick={() => handleCopyToClipboard()}
								mr="4"
							>
								<Icon as={MdContentCopy} color={theme.text.gray300} />
								<Text
									_hover={{ textDecoration: "underline" }}
									color={theme.text.gray300}
									fontSize="sm"
									fontWeight="normal"
									pl="1"
								>
									{translation("accountDetails.copy")}
								</Text>
							</Flex>
							<Flex
								color={theme.text.gray300}
								flexDirection="row"
								alignItems="center"
								cursor="pointer"
								onClick={() => openWalletOnExplorer(address)}
							>
								<Icon as={MdOutlineCallMade} color={theme.text.gray300} />
								<Text
									_hover={{ textDecoration: "underline" }}
									fontSize="sm"
									fontWeight="normal"
									pl="1"
								>
									{translation("accountDetails.viewExplorer")}
								</Text>
							</Flex>
						</Flex>
					</Flex>
				</ModalBody>
				<ModalFooter
					bgColor={theme.bg.darkBlueGray}
					justifyContent="flex-start"
					borderBottomRadius={["0", "0", "18", "18"]}
					h="max-content"
					pb="1.4rem"
				>
					{!chainId ||
					(!pendingTxs[chainId].length && !finishedTxs[chainId].length) ? (
						<Text fontSize="sm" fontWeight="semibold" color={theme.text.mono}>
							{translation("accountDetails.transactionAppear")}
						</Text>
					) : (
						<Flex flexDirection="column">
							<Flex
								justifyContent="space-between"
								w="100%"
								flexDirection="row"
								gap="12rem"
								pb={["1.1rem", "1.1rem", "1.1rem", "1.1rem"]}
							>
								<Text fontSize="sm" fontWeight="semibold">
									{translation("accountDetails.recentTransactions")}
								</Text>
								<Text
									fontSize="sm"
									fontWeight="semibold"
									color={theme.text.cyanPurple}
									_hover={{ cursor: "pointer", textDecoration: "underline" }}
									onClick={clearAll}
								>
									{translation("accountDetails.clearAll")}
								</Text>
							</Flex>

							<Flex flexDirection="column" gap={1} w="100%">
								{(pendingTxs[chainId] ?? []).map(tx => (
									<TransactionRow
										key={tx.hash}
										hash={tx.hash}
										summary={tx.summary}
										pending
									/>
								))}
								{(finishedTxs[chainId] ?? []).map(tx => (
									<TransactionRow
										key={tx.hash}
										hash={tx.hash}
										summary={tx.summary}
										success={tx.success}
									/>
								))}
							</Flex>
						</Flex>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
