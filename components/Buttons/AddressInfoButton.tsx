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
import { useToasty } from "pegasys-services";
import { usePicasso, useWallet } from "hooks";
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
import { ApprovalState } from "contexts";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const AddressInfoButton: FunctionComponent<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const { colorMode } = useColorMode();
	const {
		walletAddress: address,
		transactions,
		currentNetworkChainId: chainId,
		connectorSelected,
		approvalState,
	} = useWallet();
	const isPending = approvalState.status === ApprovalState.PENDING;
	const { toast } = useToasty();
	const [txs, setTxs] = useState<ITransactionResponse[]>([]);

	const handleCopyToClipboard = () => {
		copyToClipboard(address);

		toast({
			id: "toast1",
			position: "top-right",
			status: "success",
			title: "Successfully copied",
			description: "Address sucessfully copied to clipboard!",
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
				my={["0", "40", "40", "40"]}
				mt={["0", "0", "20rem", "20rem"]}
				h="max-content"
				position="absolute"
				bottom={["0", "0", "none", "none"]}
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
							Account
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
									Connected with {connectorSelected?.name}
								</Text>
							</Flex>
							<Flex>
								<Button
									borderRadius="full"
									border="1px solid"
									borderColor={theme.text.cyanPurple}
									px="2"
									pt="0.103rem"
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
								>
									CHANGE
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
								<Jazzicon
									diameter={15}
									seed={Math.round(Math.random() * 10000000)}
								/>
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
									Copy Address
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
									View on Explorer
								</Text>
							</Flex>
						</Flex>
					</Flex>
				</ModalBody>
				<ModalFooter
					bgColor={theme.bg.darkBlueGray}
					justifyContent="flex-start"
					h="max-content"
					pb="1.4rem"
					borderBottomRadius="30px"
				>
					{txs.length === 0 ? (
						<Text fontSize="sm" fontWeight="semibold" color={theme.text.mono}>
							Your transactions will appear here...
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
									Recent transactions
								</Text>
								<Text
									fontSize="sm"
									fontWeight="semibold"
									color={theme.text.cyanPurple}
									_hover={{ cursor: "pointer", textDecoration: "underline" }}
									onClick={() => setTxs([])}
								>
									Clear All
								</Text>
							</Flex>

							<Flex flexDirection="column" gap={1} w="100%">
								{txs.map((item: ITransactionResponse) => (
									// eslint-disable-next-line react/jsx-key
									<Flex
										alignItems="center"
										justifyContent="flex-start"
										w="100%"
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
												<Flex>
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
