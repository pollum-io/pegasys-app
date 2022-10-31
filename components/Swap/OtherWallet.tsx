import { Flex, Input, Text, useColorMode } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import React, { FunctionComponent } from "react";
import { MdOutlineArrowDownward } from "react-icons/md";
import { BiTrashAlt } from "react-icons/bi";

export const OtherWallet: FunctionComponent = () => {
	const theme = usePicasso();
	const { colorMode } = useColorMode();

	return (
		<Flex flexDirection="column">
			<Flex justifyContent="center" py="0.5rem">
				<MdOutlineArrowDownward size={22} color={theme.text.cyanPurple} />
			</Flex>
			<Flex flexDirection="column">
				<Text fontWeight="500">Send to address</Text>
			</Flex>
			<Flex
				mt="0.406rem"
				w="full"
				h="max-content"
				bgColor="transparent"
				flexDirection="row"
				gap="1"
			>
				<Flex
					mt=""
					w="full"
					h="2.875rem"
					bgColor={theme.bg.blueNavyLight}
					border="1px solid"
					borderColor={colorMode === "light" ? "#E8ECF0" : "transparent"}
					flexDirection="row"
					borderRadius="0.313rem"
				>
					<Input
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
					/>
				</Flex>

				<Flex
					_hover={{ cursor: "pointer" }}
					w="3.75rem"
					h="2.875rem"
					bgColor={theme.bg.blueNavyLight}
					flexDirection="row"
					borderRadius="0.313rem"
					justifyContent="center"
					border="1px solid"
					borderColor={colorMode === "light" ? "#E8ECF0" : "transparent"}
				>
					<Flex mt="0.6rem">
						<BiTrashAlt size={23} color="#9FA6B0" />
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};
