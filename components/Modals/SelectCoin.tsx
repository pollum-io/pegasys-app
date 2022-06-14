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
import { usePicasso } from "hooks";
import React, { useMemo, useState } from "react";
import { MdHelpOutline } from "react-icons/md";
import { BsArrowDownShort } from "react-icons/bs";
import { getDefaultTokens } from "networks";
import BigNumber from "bignumber.js";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

interface IToken {
	address: string;
	chainId: number;
	decimals: number;
	logoURI: string;
	name: string;
	symbol: string;
	balance: string;
}

export const SelectCoinModal: React.FC<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const [defaultTokens, setDefaultTokens] = useState<IToken[]>([]);
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [filter, setFilter] = useState<[]>([]);

	const handleInput = (event: Event) => {
		const { value } = event.target;

		if (value !== "") {
			const results = defaultTokens.filter(
				token => token.symbol.toLowerCase().startsWith(value.toLowerCase())
				// Use the toLowerCase() method to make it case-insensitive
			);
			console.log("1");
			setFilter(results);
		} else {
			console.log("2");
			setFilter(defaultTokens);
			// If the text field is empty, show all users
		}
	};

	const orderList = (array: any) => {
		const orderedList: IToken[] = [];
		if (order === "desc") {
			console.log("3");
			array.forEach((token: any) => {
				const firstToken = new BigNumber(array[0].balance);
				const tokenBalance = new BigNumber(token.balance);
				if (!array[0] || firstToken.isLessThanOrEqualTo(tokenBalance))
					return orderedList.unshift(token);
				return orderedList.push(token);
			});
		} else {
			console.log("4");
			array.forEach((token: any) => {
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

	useMemo(async () => {
		const request = await getDefaultTokens();
		const { tokens } = request;
		const orderedTokens = tokens
			.map((token: IToken, index: number) => {
				const obj = tokens[tokens.length - index - 1];
				obj.balance = Math.floor(Math.random() * 100).toString();
				return obj;
			})
			.sort(
				(valueA: { balance: number }, valueB: { balance: number }) =>
					valueA.balance - valueB.balance
			);
		setDefaultTokens(orderedTokens);
		setFilter(orderedTokens);
	}, []);

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
					{filter?.map((token: any, index: any) => (
						<Button
							bg="transparent"
							px="10"
							py="6"
							justifyContent="space-between"
							key={token.address + Number(index)}
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
