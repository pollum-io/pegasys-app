import React from "react";
import { useGovernance, ZERO_ADDRESS } from "pegasys-services";
import { Collapse, Flex, Input, Text, useColorMode } from "@chakra-ui/react";

import { usePicasso } from "hooks";
import { BiTrashAlt } from "react-icons/bi";
import { IUnlockVotingInput } from "./dto";

const UnlockVotingInput: React.FC<IUnlockVotingInput> = ({
	showInput,
	inputValue,
	setInputValue,
}) => {
	const { votesLocked } = useGovernance();
	const { colorMode } = useColorMode();
	const theme = usePicasso();

	return (
		<Collapse in={showInput}>
			<Flex flexDirection="column" w="100%" mb="1">
				<Text fontWeight="500">
					{votesLocked ? "Add Delegate" : "Delegate"}
				</Text>
			</Flex>
			<Flex w="100%" h="2.875rem" gap="1">
				<Flex
					w="full"
					bgColor={theme.bg.blackAlpha}
					border="1px solid"
					borderColor={colorMode === "light" ? "#E8ECF0" : "transparent"}
					borderRadius="0.313rem"
				>
					<Input
						value={inputValue}
						fontSize="1rem"
						border="none"
						placeholder="Wallet Address"
						_placeholder={{
							color: theme.text.lightGray,
							fontWeight: "normal",
							opacity: "0.8",
						}}
						textAlign="left"
						type="text"
						h="100%"
						_focus={{ outline: "none" }}
						onChange={({ target: { value } }) => setInputValue(value)}
					/>
				</Flex>
				<Flex
					_hover={{ cursor: "pointer" }}
					w="3.75rem"
					bgColor={theme.bg.blackAlpha}
					borderRadius="0.313rem"
					justifyContent="center"
					border="1px solid"
					borderColor={colorMode === "light" ? "#E8ECF0" : "transparent"}
				>
					<Flex
						mt="0.6rem"
						onClick={() => setInputValue(ZERO_ADDRESS)}
						_hover={{ opacity: "0.9" }}
					>
						<BiTrashAlt size={23} color="#9FA6B0" />
					</Flex>
				</Flex>
			</Flex>
		</Collapse>
	);
};

export default UnlockVotingInput;
