import {
	Button,
	Flex,
	IconButton,
	Img,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
	InputGroup,
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
import { TooltipComponent } from "components/Tooltip/TooltipComponent";
import { useTranslation } from "react-i18next";
import { ManageToken } from "./ManageToken";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
	selectedToken?: WrappedTokenInfo[];
	buttonId: number;
	setSelectedToken: React.Dispatch<React.SetStateAction<WrappedTokenInfo[]>>;
}

export const SelectCoinModal: React.FC<IModal> = props => {
	const { selectedToken, buttonId, setSelectedToken } = props;
	const { isOpen, onClose } = props;
	const { onOpenManageToken, isOpenManageToken, onCloseManageToken } =
		useModal();
	const theme = usePicasso();
	const [defaultTokens, setDefaultTokens] = useState<WrappedTokenInfo[]>([]);
	const [order, setOrder] = useState<"asc" | "desc">("asc");
	const [filter, setFilter] = useState<WrappedTokenInfo[]>([]);
	const [tokenError, setTokenError] = useState<WrappedTokenInfo[]>([]);
	const [arrowOrder, setArrowOrder] = useState(false);
	const { setApprovalState, approvalState } = useWallet();
	const { t: translation } = useTranslation();
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
				const firstToken = new BigNumber(array[0]?.balance as string);
				const tokenBalance = new BigNumber(token.balance as string);
				if (!array[0] || firstToken.isLessThanOrEqualTo(tokenBalance))
					return orderedList.unshift(token);
				return orderedList.push(token);
			});
		} else {
			array.forEach((token: WrappedTokenInfo) => {
				const firstToken = new BigNumber(array[0].balance as string);
				const tokenBalance = new BigNumber(token.balance as string);
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
					Number(valueB.balance) - Number(valueA.balance)
			);

		setDefaultTokens(orderedTokens);
		setFilter(orderedTokens);
	}, [userTokensBalance]);

	const handleSelectToken = useCallback(
		(id: number, token: WrappedTokenInfo) => {
			if (!selectedToken) return;
			if (
				approvalState.status === ApprovalState.APPROVED &&
				approvalState.type !== "approve"
			) {
				setApprovalState({
					status: ApprovalState.UNKNOWN,
					type: approvalState.type,
				});
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
					filteredValue?.symbol === currentToken?.symbol
			)
		);

		setTokenError(verify);
	}, [selectedToken, isOpen]);

	console.log("tokens", userTokensBalance);

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ManageToken isOpen={isOpenManageToken} onClose={onCloseManageToken} />
			<ModalOverlay />
			<ModalContent
				borderRadius="3xl"
				bgColor={theme.bg.blueNavyLight}
				bottom="0"
				mt="10"
				mb="0"
				border={["none", "1px solid transparent"]}
				borderTopRadius={["3xl", "3xl", "3xl", "3xl"]}
				borderBottomRadius={["0", "0", "3xl", "3xl"]}
				position={["absolute", "absolute", "relative", "relative"]}
				h="max-content"
			>
				<ModalHeader display="flex" alignItems="center" gap="3">
					<Text fontSize="lg" fontWeight="semibold">
						Select a token
					</Text>
					<TooltipComponent
						label={translation("searchModal.findToken")}
						icon={MdHelpOutline}
					/>
				</ModalHeader>
				<ModalCloseButton
					color={theme.icon.whiteDarkGray}
					top="4"
					size="md"
					_focus={{}}
					_hover={{}}
				/>
				<ModalBody>
					<InputGroup>
						<Input
							borderRadius="full"
							borderColor={theme.bg.blueNavyLightness}
							_placeholder={{
								color: theme.text.inputBluePurple,
								opacity: "0.6",
							}}
							placeholder="Search, name or paste address"
							onChange={handleInput}
							py={["0.1rem", "0.1rem", "1", "1"]}
							pl="10"
							_focus={{ outline: "none" }}
							_hover={{}}
						/>
						<Flex
							position="absolute"
							pl="1rem"
							pb="0.5"
							bottom={["0.3rem", "0.3rem", "0.5rem", "0.5rem"]}
						>
							<MdSearch color={theme.icon.inputSearchIcon} size={20} />
						</Flex>
					</InputGroup>
					<Flex my="5" gap="2" justifyContent="space-between">
						<Text fontSize="md" color={theme.text.cyanPurple}>
							Token name
						</Text>
						<IconButton
							as={arrowOrder ? MdArrowDownward : MdArrowUpward}
							aria-label="Order"
							minW="none"
							bg="transparent"
							color={theme.text.cyanPurple}
							w="6"
							h="6"
							onClick={() => orderList(filter)}
							mr="4"
						/>
					</Flex>
				</ModalBody>
				<Flex
					flexDirection="column"
					w="95%"
					h="10%"
					my="0"
					pr="2"
					pl="2"
					maxHeight={["20rem", "20rem", "30rem", "30rem"]}
					overflow="auto"
					css={{
						"&::-webkit-scrollbar": {
							width: "6px",
						},
						"&::-webkit-scrollbar-track": {
							width: "6px",
							scrollbarColor: " #0b172c",
						},
						"&::-webkit-scrollbar-thumb": {
							background: "#FFFFFF3D",
							borderRadius: "24px",
						},
					}}
				>
					{filter?.map((token: WrappedTokenInfo, index: number) => (
						<Button
							bg="transparent"
							px="4"
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
							_hover={{ bgColor: theme.bg.darkBlueGray }}
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
								<Text
									fontWeight="normal"
									w={token?.balance?.length > 10 ? "105px" : ""}
									overflow={token?.balance?.length > 10 ? "hidden" : ""}
									textOverflow={token?.balance?.length > 10 ? "ellipsis" : ""}
									textAlign="end"
								>
									{token?.balance as string}
								</Text>
							</Flex>
						</Button>
					))}
				</Flex>
				<Flex
					alignContent="center"
					justifyContent="center"
					flexDirection="column"
					px="0"
					py="0"
					bgColor={[
						theme.bg.blueNavy,
						theme.bg.blueNavy,
						theme.bg.blackAlpha,
						theme.bg.blackAlpha,
					]}
					alignItems="center"
					borderBottomRadius={["0px", "0", "3xl", "3xl"]}
				>
					<Flex pt="8" py="5">
						<Text
							bg={[
								theme.bg.blueNavyLightness,
								theme.bg.blueNavyLightness,
								"transparent",
								"transparent",
							]}
							px={["4.688rem", "4.688rem", "0", "0"]}
							py={["0.5rem", "0.5rem", "0", "0"]}
							borderRadius="full"
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
				</Flex>
			</ModalContent>
		</Modal>
	);
};
