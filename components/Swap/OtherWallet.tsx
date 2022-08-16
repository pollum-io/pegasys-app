import {
	Button,
	ButtonProps,
	Flex,
	Icon,
	Img,
	Input,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { usePicasso, useTokens, useWallet } from "hooks";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import {
	MdWifiProtectedSetup,
	MdHelpOutline,
	MdOutlineArrowDownward,
} from "react-icons/md";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiTrashAlt } from "react-icons/bi";
import { SelectCoinModal, SelectWallets } from "components/Modals";
import { ITokenBalance, ITokenBalanceWithId } from "types";
import { TOKENS_INITIAL_STATE } from "helpers/consts";
import { ConfirmSwap } from "components/Modals/ConfirmSwap";
import dynamic from "next/dynamic";
import { BsHandThumbsUp } from "react-icons/bs";

export const OtherWallet: FunctionComponent = () => {
	const theme = usePicasso();

	return (
		<Flex flexDirection="column">
			<Flex justifyContent="center" py="1rem">
				<MdOutlineArrowDownward size={26} color={theme.text.cyanPurple} />
			</Flex>
			<Flex flexDirection="column">
				<Text>Send to address</Text>
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
					bgColor={theme.bg.blueNavy}
					border="none"
					flexDirection="row"
					borderRadius="0.313rem"
				>
					<Input
						fontSize="1rem"
						border="none"
						placeholder="Wallet Address"
						textAlign="left"
						type="text"
						h="2.875rem"
					/>
				</Flex>

				<Flex
					_hover={{ cursor: "pointer" }}
					w="3.75rem"
					h="2.875rem"
					bgColor={theme.bg.blueNavy}
					flexDirection="row"
					borderRadius="0.313rem"
					justifyContent="center"
				>
					<Flex mt="0.6rem">
						<BiTrashAlt size={23} color="#9FA6B0" />
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};
