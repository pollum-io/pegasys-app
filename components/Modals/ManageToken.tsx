import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Button,
	Flex,
	Img,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Switch,
	Text,
	useColorMode,
} from "@chakra-ui/react";
import {
	parseENSAddress,
	useModal,
	usePicasso,
	useToasty,
	useTokensListManage,
} from "hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { returnConvertedUrl, TokenListNameOrigin } from "utils";
import { useTranslation } from "react-i18next";
import { getTokenListByUrl } from "networks";
import { ConfirmList } from "./ConfirmList";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

interface IShowListComponent {
	listUrl: string;
}

const ShowListComponent: React.FC<IShowListComponent> = ({ listUrl }) => {
	const {
		tokenListManageState,
		tokenListManageState: { byUrl: currentTokenLists },
		UseSelectedListUrl,
		removeListFromListState,
		toggleListByUrl,
	} = useTokensListManage();

	const { t: translation } = useTranslation();

	const theme = usePicasso();

	const { colorMode } = useColorMode();

	const { current: currentList } =
		currentTokenLists[listUrl] || currentTokenLists;

	const selectedListUrl = useMemo(
		() => UseSelectedListUrl(),
		[listUrl, tokenListManageState.selectedListUrl]
	);

	const isListSelected = (selectedListUrl || []).includes(listUrl);

	const toggleList = useCallback(
		() => toggleListByUrl(listUrl, !isListSelected),
		[listUrl, isListSelected]
	);

	const openListLink = (listUrl: string) =>
		window.open(`https://tokenlists.org/token-list?url=${listUrl}`, "_blank");

	return (
		<Accordion allowMultiple>
			<AccordionItem border="none">
				<Flex
					flexDirection="row"
					mt="4"
					justifyContent="space-between"
					alignItems="center"
				>
					<Flex gap="4" alignItems="center">
						<Img src={currentList?.logoURI} w="24px" h="24px" />
						<Flex flexDirection="column">
							<Text fontSize="sm" fontWeight="semibold">
								{currentList?.name}
							</Text>
							<Flex
								display="inline-block"
								maxW="160px"
								overflow="hidden"
								textOverflow="ellipsis"
								whiteSpace="nowrap"
								fontSize="sm"
								fontWeight="normal"
							>
								<TokenListNameOrigin listUrl={listUrl} />
							</Flex>
						</Flex>
					</Flex>
					<Flex alignItems="center" pr={6}>
						<AccordionButton
							background="none"
							_hover={{
								background: "none !important",
							}}
							_focus={{
								background: "none !important",
							}}
						>
							<AccordionIcon />
						</AccordionButton>

						<Switch
							size="md"
							colorScheme={colorMode === "dark" ? "cyan" : ""}
							isChecked={isListSelected}
							name={`${currentList?.name}`}
							onChange={() => toggleList()}
						/>
					</Flex>
				</Flex>

				<AccordionPanel pl={9} pr={20} py={2} border="none" display="flex">
					<Flex w="100%" flexDirection="column" alignItems="center">
						<Flex w="100%" justifyContent="flex-start" mb={1.5}>
							<Text fontSize="sm">
								{`v${currentList?.version?.major}.${currentList?.version?.minor}.${currentList?.version?.patch}`}
							</Text>
						</Flex>

						<Flex w="100%" justifyContent="space-between">
							<Text
								fontSize="xs"
								transition="200ms ease-in-out"
								color={theme.text.cyanPurple}
								cursor="pointer"
								onClick={() => openListLink(listUrl)}
								fontWeight="semibold"
								_hover={{
									opacity: "0.9",
								}}
							>
								{`${translation("searchModal.viewList")}`}
							</Text>

							<Text
								fontSize="xs"
								transition="200ms ease-in-out"
								color={theme.text.cyanPurple}
								cursor="pointer"
								fontWeight="semibold"
								onClick={() => removeListFromListState(listUrl)}
								_hover={{
									opacity: "0.9",
								}}
							>
								{`${translation("searchModal.removeList")}`}
							</Text>
						</Flex>
					</Flex>
				</AccordionPanel>
			</AccordionItem>
		</Accordion>
	);
};

export const ManageToken: React.FC<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [listUrlInput, setListUrlInput] = useState<string>("");

	const { onOpenConfirmList, isOpenConfirmList, onCloseConfirmList } =
		useModal();

	const { toast } = useToasty();

	const {
		tokenListManageState,
		tokenListManageState: { byUrl: currentTokenLists },
		addListToListState,
		removeListFromListState,
	} = useTokensListManage();

	const currentlyAddingList = Boolean(
		currentTokenLists[listUrlInput]?.loadingRequestId
	);

	const sortedLists = useMemo(() => {
		const listsUrls = Object.keys(currentTokenLists);

		return listsUrls
			.filter(listUrl => Boolean(currentTokenLists[listUrl]?.current))
			.sort((value1: string, value2: string) => {
				const { current: list1 } = currentTokenLists[value1];
				const { current: list2 } = currentTokenLists[value2];

				if (list1 && list2) {
					return list1.name.toLowerCase() < list2.name.toLowerCase()
						? -1
						: list1.name.toLowerCase() === list2.name.toLowerCase()
						? 0
						: 1;
				}

				if (list1) return -1;
				if (list2) return 1;

				return 0;
			});
	}, [tokenListManageState]);

	const validateCurrentUrl = (listUrl: string): boolean =>
		returnConvertedUrl(listUrl).length > 0 || Boolean(parseENSAddress(listUrl));

	const handleAddList = useCallback(() => {
		if (currentlyAddingList) return;

		const urlValid = validateCurrentUrl(listUrlInput);

		if (!urlValid) {
			setErrorMessage("Invalid URL, try again with a correct one!");
			onCloseConfirmList();
			return;
		}

		getTokenListByUrl(listUrlInput)
			.then(res => {
				if (res?.response && res?.id) {
					addListToListState(listUrlInput);
					onCloseConfirmList();
				}
			})
			.catch(error => {
				removeListFromListState(listUrlInput);
				onCloseConfirmList();
				setErrorMessage(error.message);
			});
	}, [currentlyAddingList, listUrlInput]);

	useEffect(() => {
		if (errorMessage !== null && errorMessage !== "") {
			toast({
				title: "Can't add list",
				description: errorMessage,
				status: "error",
			});

			setErrorMessage(null);
		}
	}, [errorMessage]);

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ConfirmList
				isOpen={isOpenConfirmList}
				onClose={onCloseConfirmList}
				handleAddList={handleAddList}
			/>
			<ModalOverlay />
			<ModalContent
				borderRadius="3xl"
				bgColor={theme.bg.blueNavy}
				px="1"
				py="2"
			>
				<ModalHeader display="flex" alignItems="center" gap="3">
					<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
						<MdArrowBack size={24} color={theme.icon.whiteGray} />
					</Flex>
					<Text fontSize="lg" fontWeight="semibold" color={theme.text.mono}>
						Manage Lists
					</Text>
				</ModalHeader>
				<ModalBody>
					<Text fontSize="sm" fontWeight="semibold" color={theme.text.mono}>
						Add a List
					</Text>
					<Flex flexDirection="row" alignItems="center" gap="3" mt="1.5">
						<Input
							borderRadius="full"
							borderColor={theme.border.lightnessGray}
							_placeholder={{ color: theme.text.lightnessGray, opacity: "0.6" }}
							placeholder="https:// or ipfs://"
							h="max-content"
							py="1"
							px="6"
							maxH="32px"
							maxW="320px"
							bgColor={theme.bg.blackAlpha}
							_focus={{ outline: "none", borderColor: theme.border.focusGray }}
							_hover={{}}
							onChange={e => setListUrlInput(e.target.value)}
						/>
						<Button
							py="2"
							px="6"
							h="max-content"
							borderRadius="67px"
							bgColor={theme.bg.blueNavyLightness}
							color={theme.text.cyan}
							fontSize="sm"
							fontWeight="semibold"
							onClick={onOpenConfirmList}
							_hover={
								listUrlInput.length === 0
									? {
											opacity: "0.3",
									  }
									: { bgColor: theme.bg.bluePurple }
							}
							disabled={listUrlInput.length === 0}
						>
							Add
						</Button>
					</Flex>

					{sortedLists?.map(listUrl => (
						<ShowListComponent listUrl={listUrl} key={listUrl} />
					))}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
