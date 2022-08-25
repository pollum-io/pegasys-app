import {
	ButtonProps,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Flex,
	Text,
	Input,
	Stack,
	Switch,
	Icon,
	PopoverArrow,
	Tooltip,
	PopoverCloseButton,
} from "@chakra-ui/react";
import React, { FunctionComponent, ReactNode, useEffect } from "react";
import { MdSettings, MdHelpOutline } from "react-icons/md";
import { usePicasso, useWallet } from "hooks";
import { IconButton } from "../Buttons/IconButton";
import { SlippageButton } from "../Buttons/SlippageButton";
import { Languages } from "./Languages";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const SettingsButton: FunctionComponent<IButtonProps> = props => {
	const theme = usePicasso();
	// const [expert, setExpert] = useState(false)
	const {
		userSlippageTolerance,
		setUserSlippageTolerance,
		setExpert,
		expert,
		isConnected,
	} = useWallet();

	return (
		<Popover placement="right">
			<PopoverTrigger {...props}>
				<IconButton
					bgColor="transparent"
					_hover={{
						background: theme.bg.iconBg,
					}}
					aria-label="Popover"
					icon={<MdSettings size={25} />}
					_expanded={{ color: theme.text.cyan }}
				/>
			</PopoverTrigger>
			<PopoverContent
				_focus={{
					outline: "none",
				}}
				bgColor={theme.bg.blueNavy}
				p="1rem 1.5rem 0.5rem"
				w={["100vw", "100vw", "24.563rem", "24.563rem"]}
				h="max-content"
				bottom={["0rem", "0rem", "3.8rem", "3.8rem"]}
				right={["0", "0", "unset", "unset"]}
				mx={["0", "0", "20", "56"]}
				position="fixed"
			>
				<Flex
					justifyContent="flex-end"
					zIndex="99"
					pr="0rem"
					pt="0rem"
					pb="2"
					h="max-content"
				>
					<PopoverCloseButton position="relative" size="md" />
				</Flex>
				<Flex
					bgColor={theme.bg.transactionSettings}
					borderRadius="7rem"
					py="2"
					justifyContent="center"
					alignItems="center"
				>
					<Text fontSize="md" fontWeight="semibold" color={theme.text.mono}>
						Transaction Settings
					</Text>
				</Flex>
				<PopoverArrow />
				<PopoverBody>
					<Flex flexDirection="column" mt="4">
						<Flex alignItems="center" flexDirection="row">
							<Text
								fontSize="md"
								pr="1"
								fontWeight="medium"
								color={theme.text.mono}
							>
								Slippage tolerance
							</Text>
							<Flex>
								<Tooltip
									label="Sua transação será revertida se o preço For alterado de forma desfavorável acima dessa porcentagem."
									position="relative"
									bgColor={theme.bg.secondary}
									color={theme.text.mono}
									borderRadius="md"
								>
									<Text as="span" _hover={{ opacity: 0.8 }}>
										<Flex pb="0.15rem">
											<Icon
												as={MdHelpOutline}
												h="4"
												w="4"
												mt="3px"
												color={theme.icon.whiteGray}
												borderRadius="full"
											/>
										</Flex>
									</Text>
								</Tooltip>
							</Flex>
						</Flex>
						<Flex flexDirection="row" py="0.5rem">
							<SlippageButton
								aria-label="Slip"
								mr="3"
								onClick={() => setUserSlippageTolerance(10)}
								bgColor={
									userSlippageTolerance === 10
										? theme.bg.slippage
										: "transparent"
								}
								color={
									userSlippageTolerance === 10
										? theme.text.mono
										: theme.text.transactionsItems
								}
							>
								0.1%
							</SlippageButton>
							<SlippageButton
								aria-label="Slip"
								mr="3"
								onClick={() => setUserSlippageTolerance(50)}
								bgColor={
									userSlippageTolerance === 50
										? theme.bg.slippage
										: "transparent"
								}
								color={
									userSlippageTolerance === 50
										? theme.text.mono
										: theme.text.transactionsItems
								}
							>
								0.5%
							</SlippageButton>
							<SlippageButton
								aria-label="Slip"
								mr="3"
								py="0.5rem"
								px="1rem"
								onClick={() => setUserSlippageTolerance(100)}
								bgColor={
									userSlippageTolerance === 100
										? theme.bg.slippage
										: "transparent"
								}
								color={
									userSlippageTolerance === 100
										? theme.text.mono
										: theme.text.transactionsItems
								}
							>
								1%
							</SlippageButton>
							<Input
								w="25%"
								h="max-content"
								py="0.3rem"
								px="0.3rem"
								m="0"
								borderRadius={36}
								type="number"
								onChange={e =>
									setUserSlippageTolerance(Number(e.target.value) * 10)
								}
								placeholder="1.0%"
								fontWeight="semibold"
								border="1px solid"
								borderColor={theme.border.borderSettings}
								textAlign="center"
								_focus={{
									outline: "none",
								}}
							/>
						</Flex>
						<Flex alignItems="center" flexDirection="row" pt="0.1rem" mt="4">
							<Text
								fontSize="md"
								pr="1"
								fontWeight="medium"
								color={theme.text.mono}
							>
								Transaction tolerance
							</Text>
							<Tooltip
								label="Sua transação será revertida se ela demorar mais do que isso."
								position="relative"
								bgColor={theme.bg.secondary}
								color={theme.text.mono}
								borderRadius="md"
							>
								<Text as="span" _hover={{ opacity: 0.8 }}>
									<Flex pb="0.15rem">
										<Icon
											as={MdHelpOutline}
											h="4"
											w="4"
											mt="3px"
											color={theme.icon.whiteGray}
											borderRadius="full"
										/>
									</Flex>
								</Text>
							</Tooltip>
						</Flex>
						<Flex flexDirection="row" py="0.5rem" alignItems="center">
							<Input
								w="20%"
								h="max-content"
								py="0.2rem"
								px="0.4rem"
								mr="3"
								borderRadius={36}
								placeholder="60"
								textAlign="center"
								fontWeight="normal"
								fontSize="md"
								border="1px solid"
								borderColor={theme.border.borderSettings}
								_focus={{
									outline: "none",
								}}
							/>
							<Text color={theme.text.mono}>Minutes</Text>
						</Flex>
						<Flex
							alignItems={["flex-start", "center", "center", "center"]}
							flexDirection={["column", "row", "row", "row"]}
							mt="4"
						>
							<Flex
								flexDirection={["row", "row", "row", "row"]}
								pb={["2", "2", "0", "0"]}
							>
								<Text
									fontSize={["sm", "md", "md", "md"]}
									pr={["1", "1", "1", "1"]}
									fontWeight="medium"
									color={theme.text.mono}
								>
									Toggle Expert Mode
								</Text>
								<Tooltip
									label="Ignora os modais de confirmação e permite alta variação de preço. Use por sua conta e risco."
									position="relative"
									bgColor={theme.bg.secondary}
									color={theme.text.mono}
									borderRadius="md"
								>
									<Text as="span" _hover={{ opacity: 0.8 }}>
										<Flex pb="0.15rem">
											<Icon
												as={MdHelpOutline}
												h="4"
												w="4"
												mt="3px"
												color={theme.icon.whiteGray}
												backgroundColor="gray.800"
												borderRadius="full"
											/>
										</Flex>
									</Text>
								</Tooltip>
							</Flex>
							<Flex flexDirection="row" ml={["2", "12", "12", "12"]}>
								<Stack align="center" direction="row">
									<Text color={theme.text.mono}>Off</Text>
									<Switch
										disabled={!isConnected}
										size="md"
										onChange={() => setExpert(!expert)}
										// colorScheme="lightPurple"
									/>
									<Text color={theme.text.mono}>On</Text>
								</Stack>
							</Flex>
						</Flex>
					</Flex>
					<Flex
						bgColor={theme.bg.transactionSettings}
						borderRadius="7rem"
						py="2"
						mt={["4", "8", "8", "8"]}
						justifyContent="center"
						alignItems="center"
					>
						<Text fontSize="md" fontWeight="semibold" color={theme.text.mono}>
							Select Language
						</Text>
					</Flex>
					<Flex justifyContent="center" alignItems="center">
						<Languages />
					</Flex>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};
