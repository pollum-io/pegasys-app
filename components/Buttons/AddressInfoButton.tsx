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
	ApprovalState,
	useTransaction,
} from "pegasys-services";
import { usePicasso } from "hooks";
import { FunctionComponent, useState, useEffect } from "react";
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

export const AddressInfoButton: FunctionComponent<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const { colorMode } = useColorMode();
	const { transactions, approvalState } = useTransaction();
	const isPending = approvalState.status === ApprovalState.PENDING;
	const { toast } = useToasty();
	const { address, chainId, connectorSelected, disconnect } = useWallet();
	const [txs, setTxs] = useState<ITransactionResponse[]>([]);
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

	const isEmpty =
		Object.keys(transactions[57]).length === 0 &&
		Object.keys(transactions[5700]).length === 0 &&
		Object.keys(transactions[2814]).length === 0;

	const explorerURL =
		chainId === 5700
			? "https://tanenbaum.io/tx"
			: chainId === 57
			? "https://explorer.syscoin.org/tx"
			: "https://explorer.testnet.rollux.com/tx";

	useEffect(() => {
		if (!isEmpty) {
			// eslint-disable-next-line
			const currentTxs: ITransactionResponse[] = [
				...Object.values(transactions[5700]),
				...Object.values(transactions[57]),
				...Object.values(transactions[2814]),
			];

			setTxs(currentTxs);
		}
	}, [
		transactions,
		isEmpty,
		transactions[57],
		transactions[5700],
		transactions[2814],
		isPending,
	]);

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				mt={["0", "6rem", "6rem", "6rem"]}
				h="max-content"
				position={["absolute", "relative", "relative", "relative"]}
				borderRadius={["30px", "35px", "35px", "35px"]}
				bottom={["0", "unset", "unset", "unset"]}
				mb={["0", "unset", "unset", "unset"]}
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
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(260.16deg, rgba(24,54,61, 0.8) 90.76%, rgba(24,54,61, 0) 97.76%) border-box`}
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
						borderRadius={12}
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
									fontSize="14px"
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
									fontSize="12px"
									fontWeight="bold"
									alignItems="center"
									bgColor="transparent"
									textTransform="uppercase"
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
					borderBottomRadius={["0", "30px", "30px", "30px"]}
					h="max-content"
					pb={["3rem", "1.4rem", "1.4rem", "1.4rem"]}
				>
					{txs.length === 0 ? (
						<Text fontSize="sm" fontWeight="semibold" color={theme.text.mono}>
							{translation("accountDetails.transactionAppear")}
						</Text>
					) : (
						<Flex flexDirection="column" w="100%">
							<Flex
								justifyContent="space-between"
								w="100%"
								flexDirection="row"
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
									onClick={() => setTxs([])}
								>
									{translation("accountDetails.clearAll")}
								</Text>
							</Flex>

							<Flex flexDirection="column" gap={1} w="100%">
								{txs.map((item: ITransactionResponse, index: number) => (
									<Flex
										alignItems="center"
										justifyContent="flex-start"
										w="100%"
										key={item.nonce + index}
									>
										{isPending && !item?.finished && (
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
											pl={!item.finished ? "2" : "0"}
										>
											<Link
												fontSize="sm"
												href={`${explorerURL}/${item?.hash}`}
												target="_blank"
												rel="noreferrer"
												alignItems="center"
												w={["65%", "max-content", "max-content", "max-content"]}
											>
												{item?.summary}
												<Icon
													as={MdOutlineCallMade}
													w="4"
													h="4"
													top="0.15rem"
													left="0.5rem"
													position="relative"
												/>
											</Link>

											{item?.finished && (
												<Flex mb="0.2rem">
													{item.confirmations === 1 ? (
														<AiOutlineCheckCircle color="#25855A" />
													) : (
														<AiOutlineCloseCircle color="#E53E3E" />
													)}
												</Flex>
											)}
										</Flex>
									</Flex>
								))}
							</Flex>
						</Flex>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
