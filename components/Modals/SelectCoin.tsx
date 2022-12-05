import {
	Button,
	Flex,
	IconButton,
	Img,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
	InputGroup,
	useMediaQuery,
	useColorMode,
} from "@chakra-ui/react";
import { useModal, usePicasso, useTokens } from "hooks";
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
	MdOutlineClose,
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
	const { t: translation } = useTranslation();
	const { userTokensBalance } = useTokens();
	const [isMobile] = useMediaQuery("(max-width: 480px)");
	const { colorMode } = useColorMode();

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
	}, [userTokensBalance, isOpen]);

	const handleSelectToken = useCallback(
		(id: number, token: WrappedTokenInfo) => {
			if (!selectedToken) return;
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

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ManageToken isOpen={isOpenManageToken} onClose={onCloseManageToken} />
			<ModalOverlay />
			<ModalContent
				borderRadius="30px"
				bottom={["0", "unset", "unset", "unset"]}
				mt={["0", "6rem", "6rem", "6rem"]}
				mb={["0", "unset", "unset", "unset"]}
				borderTop={
					colorMode === "dark"
						? ["1px solid transparent", "none", "none", "none"]
						: ["none", "none", "none", "none"]
				}
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(270.16deg, rgba(24,54,61, 0.8) 90.76%, rgba(24,54,61, 0) 97.76%) border-box`}
				borderTopRadius="30px"
				borderBottomRadius={["0", "35px", "35px", "35px"]}
				position={["absolute", "relative", "relative", "relative"]}
				h="max-content"
			>
				<ModalHeader
					display="flex"
					alignItems="center"
					justifyContent="space-between"
				>
					<Flex alignItems="center" gap="3">
						<Text fontSize="lg" fontWeight="semibold">
							{translation("swapHooks.selectToken")}
						</Text>
						<TooltipComponent
							label={translation("searchModal.findToken")}
							icon={MdHelpOutline}
						/>
					</Flex>
					<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
						<MdOutlineClose
							size={22}
							onClick={onClose}
							color={theme.text.mono}
						/>
					</Flex>
				</ModalHeader>

				<ModalBody>
					<InputGroup>
						<Input
							borderRadius="full"
							borderColor={theme.bg.blueNavyLightness}
							_placeholder={{
								color: theme.text.inputBluePurple,
								opacity: "0.6",
							}}
							placeholder={translation("searchModal.tokenSearchPlaceholder")}
							onChange={handleInput}
							py={["0.1rem", "0.1rem", "1", "1"]}
							pl="10"
							_focus={{
								outline: "none",
								borderColor: theme.border.focusBluePurple,
							}}
							_hover={{}}
						/>
						<Flex position="absolute" pl="1rem" pb="0.5" bottom="0.5rem">
							<MdSearch color={theme.icon.inputSearchIcon} size={20} />
						</Flex>
					</InputGroup>
					<Flex
						my="5"
						gap="2"
						justifyContent="space-between"
						alignItems="center"
					>
						<Text fontSize="md" color={theme.text.cyanPurple}>
							{translation("searchModal.tokenName")}
						</Text>
						<IconButton
							as={arrowOrder ? MdArrowDownward : MdArrowUpward}
							aria-label="Order"
							minW="none"
							bg="transparent"
							color={theme.text.cyanPurple}
							w="5"
							h="5"
							onClick={() => orderList(filter)}
							mr="4"
						/>
					</Flex>
				</ModalBody>
				<Flex
					flexDirection="column"
					w="95%"
					h="10%"
					my="1"
					pr="2"
					pl="2"
					maxHeight="20rem"
					overflow="auto"
					css={{
						"&::-webkit-scrollbar": {
							width: "0.375rem",
						},
						"&::-webkit-scrollbar-track": {
							width: "0.375rem",
							scrollbarColor: " #0b172c",
						},
						"&::-webkit-scrollbar-thumb": {
							background: "#FFFFFF3D",
							borderRadius: "24px",
						},
					}}
				>
					{filter.length === 0 && (
						<Flex
							ml="2rem"
							pt="2rem"
							color={theme.text.mono}
							w="90%"
							justifyContent="center"
							fontWeight="semibold"
						>
							No Tokens Found
						</Flex>
					)}
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
									w={token?.formattedBalance?.length > 10 ? "105px" : ""}
									overflow={
										token?.formattedBalance?.length > 10 ? "hidden" : ""
									}
									textOverflow={
										token?.formattedBalance?.length > 10 ? "ellipsis" : ""
									}
									textAlign="end"
								>
									{token?.formattedBalance as string}
								</Text>
							</Flex>
						</Button>
					))}
				</Flex>
				<Flex
					alignContent="center"
					justifyContent="center"
					flexDirection="column"
					bgColor={[
						theme.bg.blueNavyLight,
						theme.bg.blackAlpha,
						theme.bg.blackAlpha,
						theme.bg.blackAlpha,
					]}
					alignItems="center"
					borderBottomRadius={["0px", "30px", "30px", "30px"]}
				>
					{!isMobile ? (
						<Flex pt="8" py="5">
							<Text
								color={theme.text.cyanPurple}
								_hover={{ opacity: "0.9", cursor: "pointer" }}
								w="100%"
								fontWeight="semibold"
								onClick={onOpenManageToken}
							>
								{translation("searchModal.manageTokenLists")}
							</Text>
						</Flex>
					) : (
						<Flex pt="2rem" pb="3rem" w="88%">
							<Button
								bg={theme.bg.blueNavyLightness}
								px="4.688rem"
								py="0.5rem"
								borderRadius="full"
								color={theme.text.cyan}
								_hover={{ bgColor: theme.bg.bluePurple, cursor: "pointer" }}
								_active={{}}
								mb="0"
								w="100%"
								fontWeight="semibold"
								onClick={onOpenManageToken}
							>
								{translation("searchModal.manageTokenLists")}
							</Button>
						</Flex>
					)}
				</Flex>
			</ModalContent>
		</Modal>
	);
};
