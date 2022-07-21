import {
	Button,
	Divider,
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
} from "@chakra-ui/react";
import { usePicasso, useTokens } from "hooks";
import React, {
	ChangeEvent,
	useMemo,
	useState,
	useEffect,
	useCallback,
} from "react";
import { MdHelpOutline } from "react-icons/md";
import { BsArrowDownShort } from "react-icons/bs";
import { WrappedTokenInfo } from "types";
import BigNumber from "bignumber.js";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
	selectedToken?: WrappedTokenInfo[];
	buttonId?: number;
	setSelectedToken: React.Dispatch<React.SetStateAction<WrappedTokenInfo[]>>;
}

export const SelectCoinModal: React.FC<IModal> = props => {
	const { selectedToken, buttonId, setSelectedToken } = props;
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const [defaultTokens, setDefaultTokens] = useState<WrappedTokenInfo[]>([]);
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [filter, setFilter] = useState<WrappedTokenInfo[]>([]);
	const [tokenError, setTokenError] = useState<WrappedTokenInfo[]>([]);

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

			const actualTokens = [...selectedToken];

			actualTokens[id] = {
				...selectedToken[id],
				...token,
			} as WrappedTokenInfo;

			setSelectedToken(actualTokens);
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
			<ModalOverlay />
			<ModalContent borderRadius="xl">
				<ModalHeader display="flex" alignItems="center" gap="3">
					<Text fontSize="md" fontWeight="medium">
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
								as={MdHelpOutline}
								h="4"
								w="4"
								color="white"
								backgroundColor="gray.800"
								borderRadius="full"
							/>
						</Text>
					</Tooltip>
				</ModalHeader>
				<ModalCloseButton top="4" size="md" _focus={{}} />
				<ModalBody>
					<Input
						placeholder="Search name or paste address"
						onChange={handleInput}
					/>
					<Flex justifyContent="space-between" my="4">
						<Text>Token name</Text>
						<IconButton
							as={BsArrowDownShort}
							aria-label="Order"
							minW="none"
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
								<Img src={token.logoURI} borderRadius="full" w="6" h="6" />
								{token.symbol}
							</Flex>
							<Text fontFamily="mono" fontWeight="normal">
								{token.balance}
							</Text>
						</Button>
					))}
				</Flex>

				<ModalFooter
					alignContent="center"
					justifyContent="center"
					flexDirection="column"
					px="0"
					py="0"
				>
					<Divider />
					<Button
						bg="transparent"
						color="gray.400"
						_hover={{ color: "white" }}
						_active={{}}
						pt="8"
						pb="8"
						mb="0"
						w="100%"
					>
						Manage Token Lists
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
