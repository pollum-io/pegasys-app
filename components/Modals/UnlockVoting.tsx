import {
	Button,
	Collapse,
	Flex,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useColorMode,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, SetStateAction, useState } from "react";

import { BiTrashAlt } from "react-icons/bi";
import { FaLessThan } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useGovernance } from "pegasys-services";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const UnlockVotesModal: FunctionComponent<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const [addDelegate, setAddDelegate] = useState(false);
	const [inputValue, setInputValue] = useState<string>("");
	const { colorMode } = useColorMode();
	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
	const { votesLocked, setVotesLocked, setDelegatedTo, delegatedTo } =
		useGovernance();

	const isSelfDelegate = () => {
		setVotesLocked(false);
		setInputValue("Self");
		setDelegatedTo("Self");
		setAddDelegate(true);
		onClose();
	};

	const handleInputChange = (e: {
		target: { value: string | SetStateAction<string> };
	}) => {
		setInputValue(e.target.value);
		if (e.target.value.length < 11) {
			setIsButtonDisabled(true);
		} else {
			setIsButtonDisabled(false);
		}
	};

	const handleDelegateVotes = () => {
		setDelegatedTo(inputValue);
		setVotesLocked(false);
		onClose();
	};

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				borderRadius="30px"
				my={["0", "40", "40", "40"]}
				h="max-content"
				position={["absolute", "relative", "relative", "relative"]}
				bottom={["0", "0", "0", "0"]}
				w="100vw"
			>
				<ModalHeader
					borderTopRadius="30px"
					bgColor={theme.bg.blueNavyLight}
					pt="1.5rem"
					pb="1rem"
					flexDirection="column"
				>
					<Flex alignItems="center" justifyContent="space-between" mb="1rem">
						{votesLocked ? (
							<Text fontSize="18px" fontWeight="semibold">
								Unlock Votes
							</Text>
						) : (
							<Text fontSize="18px" fontWeight="semibold">
								Edit Vote Delegation
							</Text>
						)}
						<Flex _hover={{ cursor: "pointer" }}>
							<MdClose size={22} onClick={onClose} color={theme.text.mono} />
						</Flex>
					</Flex>
				</ModalHeader>
				<ModalBody
					bgColor={theme.bg.blueNavyLight}
					pb="6"
					flexDirection="column"
				>
					<Flex w="100%" flexDirection="column" gap="8">
						<Flex gap="6" flexDirection="column" w="100%" textAlign="justify">
							<Text fontSize="16px" color={theme.text.mono}>
								Earned PSYS tokens represent voting shares in Pegasys
								governance.
							</Text>

							<Text fontSize="16px" color={theme.text.mono}>
								You can either vote on each proposal yourself or delegate your
								votes to a third party.
							</Text>
						</Flex>
						<Flex flexDirection="column" w="100%" gap="1">
							<Collapse in={addDelegate}>
								<Flex flexDirection="column" w="100%" mb="1">
									<Text fontWeight="500">
										{votesLocked ? "Add Delegate" : "Delegate"}
									</Text>
								</Flex>
								<Flex
									w="100%"
									h="max-content"
									bgColor="transparent"
									flexDirection="row"
									gap="1"
								>
									<Flex
										w="full"
										h="2.875rem"
										bgColor={theme.bg.blackAlpha}
										border="1px solid"
										borderColor={
											colorMode === "light" ? "#E8ECF0" : "transparent"
										}
										flexDirection="row"
										borderRadius="0.313rem"
									>
										<Input
											value={inputValue}
											fontSize="1rem"
											border="none"
											placeholder="Wallet Address"
											_placeholder={{
												color: theme.text.lightGray,
												fontWeight: "normal",
												opacity: "0.8",
											}}
											textAlign="left"
											type="text"
											h="100%"
											_focus={{ outline: "none" }}
											onChange={handleInputChange}
										/>
									</Flex>

									<Flex
										_hover={{ cursor: "pointer" }}
										w="3.75rem"
										h="2.875rem"
										bgColor={theme.bg.blackAlpha}
										flexDirection="row"
										borderRadius="0.313rem"
										justifyContent="center"
										border="1px solid"
										borderColor={
											colorMode === "light" ? "#E8ECF0" : "transparent"
										}
									>
										<Flex
											mt="0.6rem"
											onClick={() => setInputValue("")}
											_hover={{ opacity: "0.9" }}
										>
											<BiTrashAlt size={23} color="#9FA6B0" />
										</Flex>
									</Flex>
								</Flex>
							</Collapse>
						</Flex>
					</Flex>
				</ModalBody>

				<ModalFooter
					pt="0.5rem"
					pb="1.5rem"
					bgColor={theme.bg.blueNavyLight}
					justifyContent="center"
					borderBottomRadius={["0", "30px", "30px", "30px"]}
				>
					<Flex w="100%" alignItems="center" flexDirection="column" gap="0">
						<Flex w="100%" alignItems="center" flexDirection="column" gap="6">
							<Flex w="100%">
								<Button
									id="self"
									fontWeight="semibold"
									w="100%"
									fontSize="16px"
									py="0.8rem"
									bgColor={theme.bg.blueNavyLightness}
									color={theme.text.cyan}
									_hover={
										(
											votesLocked
												? addDelegate
													? isButtonDisabled
													: false
												: inputValue.length < 11 || inputValue === delegatedTo
										)
											? {
													opacity: "0.3",
											  }
											: { bgColor: theme.bg.bluePurple }
									}
									borderRadius="full"
									onClick={!addDelegate ? isSelfDelegate : handleDelegateVotes}
									disabled={
										votesLocked
											? addDelegate
												? isButtonDisabled
												: false
											: inputValue.length < 11 || inputValue === delegatedTo
									}
								>
									{votesLocked
										? !addDelegate
											? "Self Delegate"
											: "Delegate Votes"
										: "Update Vote Delegation"}
								</Button>
							</Flex>
							<Flex
								pl="0.2rem"
								justifyContent="center"
								_hover={{ cursor: "pointer", opacity: "0.9" }}
								fontWeight="semibold"
								transition="100ms ease-in-out"
								textAlign="center"
								color={theme.text.cyanPurple}
								fontSize="14px"
								gap="1"
								onClick={
									votesLocked ? () => setAddDelegate(!addDelegate) : onClose
								}
							>
								{!addDelegate ? (
									<Flex gap="1">
										<Text>Add delegate</Text>
										<Text>+</Text>
									</Flex>
								) : (
									<Flex alignItems="baseline" gap="1">
										<FaLessThan size={10} fontWeight="normal" />
										<Text fontWeight="semibold">Back</Text>
									</Flex>
								)}
							</Flex>
						</Flex>
					</Flex>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
