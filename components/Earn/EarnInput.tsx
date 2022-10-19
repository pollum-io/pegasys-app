import React from "react";
import {
	Collapse,
	Flex,
	Input,
	InputGroup,
	InputRightAddon,
	Text,
} from "@chakra-ui/react";

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
						borderColor={theme.border.farmInput}
						bgColor={theme.bg.blackAlpha}
						borderLeftRadius="full"
						w="25rem"
						_hover={{}}
						_focus={{
							outline: "none",
						}}
						value={deposit ? depositTypedValue : withdrawTypedValue}
						onChange={event => onChange(event.target.value)}
					/>
					<InputRightAddon
						border="1px solid"
						borderColor={theme.border.farmInput}
						background={theme.bg.max}
						borderRightRadius="full"
						color={theme.text.max}
						fontSize="lg"
						fontWeight="normal"
						transition="100ms ease-in-out"
						_hover={{
							borderColor: theme.border.farmInput,
							bgColor: theme.bg.blueNavyLightness,
							color: theme.text.cyan,
							cursor: "pointer",
						}}
						onClick={() => {
							const value = deposit
								? selectedOpportunity.unstakedAmount.toExact()
								: selectedOpportunity.stakedAmount.toExact();

							onChange(value);
						}}
					>
						max
					</InputRightAddon>
				</InputGroup>
			</Flex>
			<Collapse in={withdrawPercentage === 100} animateOpacity>
				<Text fontWeight="normal" mt="2">
					Unclaimed {selectedOpportunity.rewardToken.symbol}:{" "}
					{selectedOpportunity.unclaimedAmount.toExact()}
				</Text>
			</Collapse>
		</>
	);
};

export default EarnInput;
