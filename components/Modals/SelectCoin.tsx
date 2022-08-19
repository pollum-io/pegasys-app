import {
	Button,
	Flex,
	Icon,
	IconButton,
	Img,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Tooltip,
	InputGroup,
	InputLeftElement,
} from "@chakra-ui/react";
import {
	ApprovalState,
	useModal,
	usePicasso,
	useTokens,
	useWallet,
} from "hooks";
import React, {
	ChangeEvent,
	useMemo,
	useState,
	useEffect,
	useCallback,
} from "react";
import {
	MdHelpOutline,
	MdArrowDownward,
	MdArrowUpward,
	MdSearch,
} from "react-icons/md";
import { WrappedTokenInfo } from "types";
import BigNumber from "bignumber.js";
import { ManageToken } from "./ManageToken";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
	selectedToken?: WrappedTokenInfo[];
	buttonId: number;
	setSelectedToken: React.Dispatch<React.SetStateAction<WrappedTokenInfo[]>>;
}

export const SelectCoinModal: React.FC<IModal> = props => {
	const { selectedToken, buttonId, setSelectedToken, approvalState } = props;
	const { isOpen, onClose } = props;
	const { onOpenManageToken, isOpenManageToken, onCloseManageToken } =
		useModal();
	const theme = usePicasso();
	const [defaultTokens, setDefaultTokens] = useState<WrappedTokenInfo[]>([]);
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [filter, setFilter] = useState<WrappedTokenInfo[]>([]);
	const [tokenError, setTokenError] = useState<WrappedTokenInfo[]>([]);
	const [arrowOrder, setArrowOrder] = useState(false);
	const { setApprovalState } = useWallet();

	const { userTokensBalance } = useTokens();

	const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;

		if (inputValue !== "") {
			const results = defaultTokens.filter(token =>
				token?.symbol?.toLowerCase().startsWith(inputValue.toLowerCase())
			);
			setFilter(results);
		} else {
			setFilter(defaultTokens);
		}
	};

	const orderList = (array: WrappedTokenInfo[]) => {
		const orderedList: WrappedTokenInfo[] = [];
		if (order === "desc") {
			array?.forEach((token: WrappedTokenInfo) => {
				const firstToken = new BigNumber(array[0]?.balance);
				const tokenBalance = new BigNumber(token.balance);
				if (!array[0] || firstToken.isLessThanOrEqualTo(tokenBalance))
					return orderedList.unshift(token);
				return orderedList.push(token);
			});
		} else {
			array.forEach((token: WrappedTokenInfo) => {
				const firstToken = new BigNumber(array[0].balance);
				const tokenBalance = new BigNumber(token.balance);
				if (
					!array[array.length - 1] ||
					firstToken.isLessThanOrEqualTo(tokenBalance)
				)
					return orderedList.push(token);
				return orderedList.unshift(token);
			});
		}
		setArrowOrder(!arrowOrder);
		setOrder(previousState => (previousState === "asc" ? "desc" : "asc"));
		setFilter(orderedList);
	};

	useMemo(() => {
		const orderedTokens = userTokensBalance
			.map((token, index: number) => {
				const obj = userTokensBalance[userTokensBalance.length - index - 1];

				return obj;
			})
			.sort(
				(valueA: { balance: string }, valueB: { balance: string }) =>
					Number(valueA.balance) - Number(valueB.balance)
			);

		setDefaultTokens(orderedTokens);
		setFilter(orderedTokens);
	}, [userTokensBalance]);

	const handleSelectToken = useCallback(
		(id: number, token: WrappedTokenInfo) => {
			if (!selectedToken) return;
			if (approvalState === ApprovalState.APPROVED) {
				setApprovalState(ApprovalState.UNKNOWN);
			}
			setSelectedToken((prevState: WrappedTokenInfo[]) => {
				prevState[id] = new WrappedTokenInfo(token.tokenInfo);

				return prevState as WrappedTokenInfo[];
			});
		},
		[selectedToken]
	);

	useEffect(() => {
		if (!selectedToken) return;

		const verify = selectedToken?.filter((currentToken: WrappedTokenInfo) =>
			filter?.some(
				(filteredValue: WrappedTokenInfo) =>
					filteredValue?.symbol === currentToken.symbol
			)
		);

		setTokenError(verify);
	}, [selectedToken, isOpen]);

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ManageToken isOpen={isOpenManageToken} onClose={onCloseManageToken} />
			<ModalOverlay />
			<ModalContent
				borderRadius="3xl"
				bgColor={theme.bg.blueNavyLight}
				bottom="0"
				mt="16"
				mb="0"
				border={["none", "1px solid transparent"]}
				borderTopRadius={["3xl", "3xl", "3xl", "3xl"]}
				borderBottomRadius={["0", "0", "3xl", "3xl"]}
				position="relative"
				h="max-content"
			>
				<ModalHeader display="flex" alignItems="center" gap="3">
					<Text fontSize="lg" fontWeight="semibold">
						Select a token
					</Text>
					<Tooltip
						label="Find a token by searching for its name or symbol or by pasting its address below."
						position="relative"
						bgColor={theme.bg.secondary}
						color={theme.text.mono}
						borderRadius="md"
					>
						<Text as="span" _hover={{ opacity: 0.8 }}>
							<Icon
								mt="2"
								as={MdHelpOutline}
								h="5"
								w="5"
								color={theme.icon.helpIcon}
								borderRadius="full"
							/>
						</Text>
					</Tooltip>
				</ModalHeader>
				<ModalCloseButton
					color={theme.icon.closeWhiteGray}
					top="4"
					size="md"
					_focus={{}}
				/>
				<ModalBody>
					<InputGroup>
						<Input
							borderRadius="full"
							borderColor="rgba(21, 61, 111, 1)"
							_placeholder={{ color: theme.text.input, opacity: "0.6" }}
							placeholder="Search, name or paste address"
							onChange={handleInput}
							py={["0.1rem", "0.1rem", "1", "1"]}
							pl="10"
							_hover={{ border: "1px solid #3182CE" }}
							_focus={{ border: "1px solid #3182CE", outline: "none" }}
						/>
						<Flex
							position="absolute"
							pl="1rem"
							pb="0.5"
							bottom={["0.3rem", "0.3rem", "0.5rem", "0.5rem"]}
						>
							<MdSearch color={theme.icon.searchIcon} size={20} />
						</Flex>
					</InputGroup>
					<Flex my="5" gap="2">
						<Text fontSize="md" color={theme.text.cyanPurple}>
							Token name
						</Text>
						<IconButton
							as={arrowOrder ? MdArrowUpward : MdArrowDownward}
							aria-label="Order"
							minW="none"
							bg="transparent"
							color={theme.text.cyanPurple}
							w="6"
							h="6"
							onClick={() => orderList(filter)}
						/>
					</Flex>
				</ModalBody>
				<Flex flexDirection="column">
					{filter?.map((token: WrappedTokenInfo, index: number) => (
						<Button
							bg="transparent"
							px="10"
							py="6"
							justifyContent="space-between"
							key={token.address + Number(index)}
							disabled={
								token.symbol === tokenError[0]?.symbol ||
								token.symbol === tokenError[1]?.symbol
							}
							onClick={() => {
								handleSelectToken(buttonId as number, token);
								onClose();
							}}
						>
							<Flex
								gap="4"
								alignItems="center"
								justifyContent="flex-start"
								w="100%"
							>
								<Flex
									gap="4"
									alignItems="center"
									justifyContent="flex-start"
									w="100%"
								>
									<Img src={token.logoURI} borderRadius="full" w="6" h="6" />
									{token.symbol}
								</Flex>
								<Text fontFamily="mono" fontWeight="normal">
									{token.balance}
								</Text>
							</Flex>
						</Button>
					))}
				</Flex>

				<ModalFooter
					alignContent="center"
					justifyContent="center"
					flexDirection="column"
					px="0"
					py="0"
					bgColor={theme.bg.blackAlpha}
					alignItems="center"
					borderBottomRadius={["0px", "0", "3xl", "3xl"]}
				>
					<Flex pt="8" py="5">
						<Text
							bg="transparent"
							color={theme.text.cyanPurple}
							_hover={{ opacity: "0.9", cursor: "pointer" }}
							_active={{}}
							mb="0"
							w="100%"
							fontWeight="semibold"
							onClick={onOpenManageToken}
						>
							Manage Token Lists
						</Text>
					</Flex>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
