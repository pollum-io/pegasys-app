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
	PopoverArrow,
	PopoverCloseButton,
	useColorMode,
} from "@chakra-ui/react";
import React, { FunctionComponent, ReactNode, useState } from "react";
import { MdSettings, MdHelpOutline } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import { usePicasso } from "hooks";
import { mockedSlippageValues } from "helpers/mockedData";
import { useTranslation } from "react-i18next";
import { TooltipComponent } from "components/Tooltip/TooltipComponent";
import {
	useWallet,
	usePegasys,
	DEFAULT_DEADLINE_FROM_NOW,
} from "pegasys-services";
import { IconButton } from "../Buttons/IconButton";
import { SlippageButton } from "../Buttons/SlippageButton";
import { Languages } from "./Languages";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

enum SlippageError {
	InvalidInput = "InvalidInput",
	RiskyLow = "RiskyLow",
	RiskyHigh = "RiskyHigh",
}

enum DeadlineError {
	InvalidInput = "InvalidInput",
}

export const SettingsButton: FunctionComponent<IButtonProps> = props => {
	const [slippageInputValue, setSlippageInputValue] = useState<string>("");
	const [deadlineInputValue, setDeadlineInputValue] = useState<string>("");

	const theme = usePicasso();
	const { colorMode } = useColorMode();
	// const [expert, setExpert] = useState(false)
	const {
		userSlippageTolerance,
		setUserSlippageTolerance,
		userTransactionDeadlineValue,
		setUserTransactionDeadlineValue,
		setExpert,
		expert,
	} = usePegasys();

	const { isConnected } = useWallet();

	const { t: translation, i18n } = useTranslation();

	const { language } = i18n;

	// Transaction Slippage handlers - Validations //
	const parseCustomTransactionSlippageValue = (slippageValue: string) => {
		if (slippageValue === "") {
			setUserSlippageTolerance(50); // Reset slippage value if user let the input empty
			setSlippageInputValue("");
			return;
		}

		setSlippageInputValue(slippageValue);

		const valueAsIntFromRoundedFloat = parseFloat(
			(Number(slippageValue) * 100).toString()
		);

		if (
			!Number.isNaN(valueAsIntFromRoundedFloat) &&
			valueAsIntFromRoundedFloat < 5000
		) {
			setUserSlippageTolerance(valueAsIntFromRoundedFloat);
		}
	};

	const slippageInputIsValid =
		slippageInputValue === "" ||
		(userSlippageTolerance / 100).toFixed(2) ===
			Number.parseFloat(slippageInputValue).toFixed(2);

	let slippageInputErrors: SlippageError | undefined;

	if (slippageInputValue !== "" && !slippageInputIsValid) {
		slippageInputErrors = SlippageError.InvalidInput;
	} else if (slippageInputIsValid && userSlippageTolerance < 50) {
		slippageInputErrors = SlippageError.RiskyLow;
	} else if (slippageInputIsValid && userSlippageTolerance > 500) {
		slippageInputErrors = SlippageError.RiskyHigh;
	} else {
		slippageInputErrors = undefined;
	}

	// END Transaction Slippage handlers - Validations //

	// Transaction Deadline handlers - Validations //

	const parseCustomTransactionDeadlineValue = (deadlineValue: string) => {
		if (deadlineValue === "") {
			setUserTransactionDeadlineValue(DEFAULT_DEADLINE_FROM_NOW); // Reset deadline value if user let the input empty
			setDeadlineInputValue("");
			return;
		}

		setDeadlineInputValue(deadlineValue);

		const transformValueAsInt: number = Number(deadlineValue) * 60;

		if (!Number.isNaN(transformValueAsInt) && transformValueAsInt > 0) {
			setUserTransactionDeadlineValue(transformValueAsInt);
		}
	};

	const deadlineInputIsValid =
		deadlineInputValue === "" ||
		(Number(userTransactionDeadlineValue) / 60).toString() ===
			deadlineInputValue;

	let deadlineInputError: DeadlineError | undefined;

	if (deadlineInputValue !== "" && !deadlineInputIsValid) {
		deadlineInputError = DeadlineError.InvalidInput;
	} else {
		deadlineInputError = undefined;
	}

	// END Transaction Deadline handlers - Validations //

	return (
		<Popover placement="right">
			<PopoverTrigger {...props}>
				<IconButton
					bgColor="transparent"
					_hover={{
						color: theme.text.cyanPurple,
					}}
					aria-label="Popover"
					icon={<MdSettings size={25} />}
					_expanded={{ color: theme.text.cyanPurple }}
				/>
			</PopoverTrigger>
			<PopoverContent
				borderRadius="12px"
				borderBottomRadius={["none", "12px", "12px", "12px"]}
				borderColor={theme.bg.blueNavy}
				_focus={{
					outline: "none",
				}}
				bgColor={theme.bg.blueNavy}
				p="1rem 1.5rem 0.5rem"
				w={["100vw", "24.563rem", "24.563rem", "24.563rem"]}
				h="max-content"
				bottom={["0rem", "3.8rem", "3.8rem", "3.8rem"]}
				mx={["0", "0", "56", "56"]}
				right={["unset", "5%", "unset", "unset"]}
				left={["0", "unset", "unset", "unset"]}
				position="fixed"
				boxShadow="0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
			>
				<PopoverArrow bg={theme.bg.blueNavyLight} />
				<Flex
					justifyContent="flex-end"
					zIndex="99"
					pr="0rem"
					pt="0rem"
					pb="2"
					h="max-content"
					display={["flex", "flex", "none", "none"]}
				>
					<PopoverCloseButton position="relative" size="md" />
				</Flex>
				<Flex
					bgColor={theme.bg.alphaLightGray}
					borderRadius="7rem"
					py="2"
					justifyContent="center"
					alignItems="center"
				>
					<Text fontSize="md" fontWeight="semibold" color={theme.text.mono}>
						{translation("settings.transactionSettings")}
					</Text>
				</Flex>
				<PopoverBody p="0">
					<Flex flexDirection="column" mt="4" w="100%">
						<Flex
							alignItems="center"
							flexDirection="row"
							w="max-content"
							left="0"
						>
							<Text
								fontSize="md"
								pr="1"
								fontWeight="medium"
								color={theme.text.mono}
							>
								{translation("transactionSettings.slippageTolerance")}
							</Text>
							<Flex>
								<TooltipComponent
									label={translation(
										"transactionSettings.transactionRevertSlippageHelper"
									)}
									icon={MdHelpOutline}
								/>
							</Flex>
						</Flex>
						<Flex flexDirection="row" py="0.5rem" alignItems="center">
							{mockedSlippageValues.map(slippageValue => (
								<SlippageButton
									key={slippageValue.id}
									aria-label="Slip"
									mr="3"
									onClick={() => {
										setUserSlippageTolerance(slippageValue.valueInBips);
										setSlippageInputValue("");
									}}
									bgColor={
										userSlippageTolerance === slippageValue.valueInBips
											? theme.bg.softBluePink
											: "transparent"
									}
									color={
										userSlippageTolerance === slippageValue.valueInBips
											? theme.text.mono
											: theme.text.softGray
									}
								>
									{slippageValue.valueInBips / 100}%
								</SlippageButton>
							))}

							<SlippageButton
								_hover={{}}
								aria-label="Slip"
								w="30%"
								padding="0"
								borderRadius={36}
								border="1px solid"
								borderColor={
									!slippageInputIsValid ? "#FF6871" : theme.text.lightGray
								}
							>
								<Flex alignItems="center">
									{!!slippageInputValue &&
									(slippageInputErrors === SlippageError.RiskyLow ||
										slippageInputErrors === SlippageError.RiskyHigh) ? (
										<Text
											role="img"
											aria-label="warning"
											position="absolute"
											left="0.625rem"
										>
											<IoWarningOutline color="orange" />
										</Text>
									) : null}
									<Input
										w="100%"
										h="max-content"
										py="0.3rem"
										px="0.3rem"
										m="0"
										border="none"
										value={slippageInputValue}
										type="number"
										color={!slippageInputIsValid ? "red" : ""}
										onChange={e =>
											parseCustomTransactionSlippageValue(e.target.value)
										}
										placeholder={(userSlippageTolerance / 100).toFixed(2)}
										fontWeight="normal"
										textAlign="center"
										_focus={{
											outline: "none",
											borderColor: theme.border.focusGray,
										}}
									/>
									<Text position="absolute" left="75%">
										%
									</Text>
								</Flex>
							</SlippageButton>
						</Flex>
						{!!slippageInputErrors && (
							<Text
								fontSize="sm"
								color={
									slippageInputErrors === SlippageError.InvalidInput
										? "red"
										: "#F3841E"
								}
							>
								{slippageInputErrors === SlippageError.InvalidInput
									? translation("transactionSettings.enterValidSlippage")
									: slippageInputErrors === SlippageError.RiskyLow
									? translation("transactionSettings.transactionMayFail")
									: translation("transactionSettings.transactionMayFrontrun")}
							</Text>
						)}
						<Flex alignItems="center" flexDirection="row" pt="0.1rem" mt="4">
							<Text
								fontSize="md"
								pr="1"
								fontWeight="medium"
								color={theme.text.mono}
							>
								{translation("settings.transactionTolerance")}
							</Text>
							<TooltipComponent
								label={translation(
									"transactionSettings.transactionRevertDeadlineHelper"
								)}
								icon={MdHelpOutline}
							/>
						</Flex>
						<Flex flexDirection="row" py="0.5rem" alignItems="center">
							<Input
								w="20%"
								h="max-content"
								py="0.2rem"
								px="0.4rem"
								mr="3"
								color={deadlineInputError ? "red" : undefined}
								borderRadius={36}
								placeholder={(
									Number(userTransactionDeadlineValue) / 60
								).toString()}
								textAlign="center"
								fontWeight="normal"
								fontSize="md"
								border="1px solid"
								borderColor={
									deadlineInputError ? "#FF6871" : theme.text.lightGray
								}
								value={deadlineInputValue}
								_focus={{
									outline: "none",
									borderColor: theme.border.focusGray,
								}}
								onChange={e =>
									parseCustomTransactionDeadlineValue(e.target.value)
								}
								_hover={{}}
							/>
							<Text color={theme.text.mono}>
								{translation("transactionSettings.minutes")}
							</Text>
						</Flex>
						<Flex
							alignItems="center"
							flexDirection="row"
							mt="4"
							h="max-content"
							justifyContent="space-between"
						>
							<Flex
								pt="0.1rem"
								mt="0"
								flexDirection={["row", "row", "row", "row"]}
								pb={["2", "2", "0", "0"]}
								alignItems="center"
								w={
									language === "de" || language === "vn"
										? ["8rem", "max-content", "10rem", "10rem"]
										: "unset"
								}
							>
								<Text
									fontSize={["sm", "md", "md", "md"]}
									pr="1"
									fontWeight="medium"
									color={theme.text.mono}
									w={
										language === "de" || language === "vn"
											? "unset"
											: "max-content"
									}
								>
									{translation("settings.toggleExpertMode")}
								</Text>
								<TooltipComponent
									label={translation(
										"transactionSettings.transactionRevertDeadlineHelper"
									)}
									icon={MdHelpOutline}
								/>
							</Flex>
							<Flex flexDirection="row" mb={["1", "1", "-1", "-1"]}>
								<Stack align="center" direction="row">
									<Text color={theme.text.mono}>
										{translation("toggle.off")}
									</Text>
									<Switch
										disabled={!isConnected}
										size="md"
										onChange={() => setExpert(!expert)}
									/>
									<Text color={theme.text.mono}>
										{translation("toggle.on")}
									</Text>
								</Stack>
							</Flex>
						</Flex>
					</Flex>
					<Flex
						bgColor={theme.bg.alphaLightGray}
						borderRadius="7rem"
						py="2"
						mt={["8", "8", "8", "8"]}
						justifyContent="center"
						alignItems="center"
					>
						<Text fontSize="md" fontWeight="semibold" color={theme.text.mono}>
							{translation("settings.selectLanguage")}
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
