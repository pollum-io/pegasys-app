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
} from "@chakra-ui/react";
import React, {
	FunctionComponent,
	ReactNode,
	useEffect,
	useState,
} from "react";
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
	const { setExpert, expert } = useWallet();

	useEffect(() => {
		console.log("expert: ", expert);
	}, [expert]);
	const [slippage, setSlippage] = useState<string>("");

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
				/>
			</PopoverTrigger>
			<PopoverContent
				bgColor={theme.bg.blueNavy}
				p="1rem 1.5rem 0.5rem"
				w={["100vw", "100vw", "24.563rem", "24.563rem"]}
				h="max-content"
				bottom={["0rem", "0rem", "3.8rem", "3.8rem"]}
				right={["0", "0", "", ""]}
				mx={["0", "0", "20", "56"]}
				position="fixed"
			>
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
							<Icon as={MdHelpOutline} color={theme.icon.whiteGray} />
						</Flex>
						<Flex flexDirection="row" py="0.5rem">
							<SlippageButton
								aria-label="Slip"
								mr="3"
								onClick={() => setSlippage("1")}
								bgColor={slippage === "1" ? theme.bg.slippage : "transparent"}
								color={
									slippage === "1"
										? theme.text.mono
										: theme.text.transactionsItems
								}
							>
								0.1%
							</SlippageButton>
							<SlippageButton
								aria-label="Slip"
								mr="3"
								onClick={() => setSlippage("2")}
								bgColor={slippage === "2" ? theme.bg.slippage : "transparent"}
								color={
									slippage === "2"
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
								onClick={() => setSlippage("3")}
								bgColor={slippage === "3" ? theme.bg.slippage : "transparent"}
								color={
									slippage === "3"
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
								placeholder="1.0%"
								fontWeight="semibold"
								border="1px solid"
								borderColor={theme.border.borderSettings}
								textAlign="center"
								_focus={{
									borderColor: theme.border.borderSettings,
								}}
								_hover={{
									borderColor: theme.border.borderSettings,
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
							<Icon as={MdHelpOutline} color={theme.icon.whiteGray} />
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
									borderColor: theme.border.borderSettings,
								}}
								_hover={{
									borderColor: theme.border.borderSettings,
								}}
							/>
							<Text color={theme.text.mono}>Minutes</Text>
						</Flex>
						<Flex alignItems="center" flexDirection="row" mt="4">
							<Text
								fontSize="md"
								pr="1"
								fontWeight="medium"
								color={theme.text.mono}
							>
								Toggle Expert Mode
							</Text>
							<Icon as={MdHelpOutline} color={theme.icon.whiteGray} />
							<Flex flexDirection="row" ml="12">
								<Stack align="center" direction="row">
									<Text color={theme.text.mono}>Off</Text>
									<Switch
										size="md"
										colorScheme="teal"
										onChange={() => setExpert(!expert)}
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
						mt="8"
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
