import React, { useRef } from "react";
import {
	Collapse,
	Flex,
	Input,
	InputGroup,
	InputRightAddon,
	Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { usePicasso } from "hooks";
import { useEarn } from "pegasys-services";

interface IEarnInputProps {
	deposit?: boolean;
}

const EarnInput: React.FC<IEarnInputProps> = ({ deposit }) => {
	const {
		selectedOpportunity,
		depositTypedValue,
		setDepositTypedValue,
		withdrawTypedValue,
		setWithdrawTypedValue,
		withdrawPercentage,
	} = useEarn();
	const theme = usePicasso();
	const textInput = useRef<HTMLInputElement>(null);
	const { t } = useTranslation();

	const onChange = (value: string) => {
		if (deposit) {
			setDepositTypedValue(value);
		} else {
			setWithdrawTypedValue(value);
		}
	};

	if (!selectedOpportunity) {
		return null;
	}

	return (
		<>
			<Flex>
				<InputGroup size="md">
					<Input
						placeholder="0.0"
						border="1px solid"
						borderColor={theme.border.darkBlueGray}
						bgColor={theme.bg.blackAlpha}
						borderLeftRadius="full"
						w="25rem"
						_hover={{}}
						_focus={{
							outline: "none",
						}}
						value={deposit ? depositTypedValue : withdrawTypedValue}
						onChange={e => onChange(e.target.value)}
						ref={textInput}
						autoFocus
						onBlur={() => textInput?.current?.focus()}
					/>
					<InputRightAddon
						border="1px solid"
						borderColor={theme.border.darkBlueGray}
						background={theme.bg.darkBlueGray}
						borderRightRadius="full"
						color={theme.text.cyanDarkGray}
						fontSize="lg"
						fontWeight="normal"
						transition="100ms ease-in-out"
						_hover={{
							bgColor: theme.bg.blueLightPurple,

							cursor: "pointer",
						}}
						onClick={() => {
							const value = deposit
								? selectedOpportunity.unstakedAmount.toExact()
								: selectedOpportunity.stakedAmount.toExact();

							onChange(value);
						}}
					>
						{t("earnPages.max")}
					</InputRightAddon>
				</InputGroup>
			</Flex>
			<Collapse in={!deposit && withdrawPercentage === 100} animateOpacity>
				<Text fontWeight="normal" mt="2">
					{t("earnPages.unclaimed", {
						token: selectedOpportunity.rewardToken.symbol,
					})}
					: {selectedOpportunity.unclaimedAmount.toExact()}
				</Text>
			</Collapse>
		</>
	);
};

export default EarnInput;
