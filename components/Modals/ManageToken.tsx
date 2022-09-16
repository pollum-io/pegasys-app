import {
	Button,
	Flex,
	Icon,
	Img,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Switch,
	Text,
} from "@chakra-ui/react";
import { useModal, usePicasso, useTokensListManage } from "hooks";
import { useCallback, useMemo } from "react";
import { MdArrowBack, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { TokenListNameOrigin } from "utils";
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
		addListToListState,
		toggleListByUrl,
	} = useTokensListManage();

	const { current: currentList } = currentTokenLists[listUrl];

	const selectedListUrl = useMemo(
		() => UseSelectedListUrl(),
		[listUrl, tokenListManageState.selectedListUrl]
	);

	const isListSelected = (selectedListUrl || []).includes(listUrl);

	const toggleList = useCallback(
		() => toggleListByUrl(listUrl, !isListSelected),
		[listUrl, isListSelected]
	);

	return (
		<Flex
			flexDirection="row"
			mt="4"
			justifyContent="space-between"
			alignItems="center"
		>
			<Flex gap="4" alignItems="center">
				<Img src={currentList?.logoURI} w="5" h="5" />
				<Flex flexDirection="column">
					<Text fontWeight="semibold">{currentList?.name}</Text>
					<Flex
						display="inline-block"
						maxW="160px"
						overflow="hidden"
						textOverflow="ellipsis"
						whiteSpace="nowrap"
					>
						<TokenListNameOrigin listUrl={listUrl} />
					</Flex>
				</Flex>
			</Flex>
			<Flex gap="4" pr="6">
				<Icon as={MdOutlineKeyboardArrowDown} w="5" h="5" />
				<Switch
					size="md"
					colorScheme="cyan"
					isChecked={isListSelected}
					name={`${currentList?.name}`}
					onChange={() => toggleList()}
				/>
			</Flex>
		</Flex>
	);
};

export const ManageToken: React.FC<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const { onOpenConfirmList, isOpenConfirmList, onCloseConfirmList } =
		useModal();

	const {
		tokenListManageState,
		tokenListManageState: { byUrl: currentTokenLists },
	} = useTokensListManage();

	const sortedLists = useMemo(() => {
		const listsUrls = Object.keys(currentTokenLists);

		return listsUrls
			.filter(listUrl => Boolean(currentTokenLists[listUrl].current))
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
	}, [tokenListManageState.selectedListUrl, currentTokenLists]);

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ConfirmList isOpen={isOpenConfirmList} onClose={onCloseConfirmList} />
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
					<Flex flexDirection="row" alignItems="baseline" gap="3" mt="3">
						<Input
							borderRadius="full"
							borderColor={theme.border.manageInput}
							_placeholder={{ color: theme.text.manageInput, opacity: "0.6" }}
							placeholder="https:// or ipfs://"
							h="max-content"
							py="1"
							px="6"
							bgColor={theme.bg.blackAlpha}
							_focus={{ outline: "none" }}
							_hover={{}}
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
							_hover={{
								bgColor: theme.bg.bluePurple,
							}}
						>
							Add
						</Button>
					</Flex>

					{sortedLists.map(listUrl => (
						<ShowListComponent listUrl={listUrl} key={listUrl} />
					))}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
