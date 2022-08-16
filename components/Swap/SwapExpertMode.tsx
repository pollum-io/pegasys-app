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

export const SwapExpertMode: FunctionComponent = () => {
	const theme = usePicasso();
	const { otherWallet, setOtherWallet } = useWallet();

	useEffect(() => {
		console.log("mudou", otherWallet);
	}, [otherWallet]);

	return (
		<Flex flexDirection="column" py="1rem" border="transparent" mb="-1">
			<Flex flex-direction="row" fontSize="0.875rem" gap="1">
				<Flex
					color={theme.text.cyanPurple}
					fontWeight="semi-bold"
					onClick={() => setOtherWallet(!otherWallet)}
					_hover={{ cursor: "pointer" }}
				>
					Send to another wallet{" "}
				</Flex>
				<Text color="#718096">(optional)</Text>
			</Flex>
		</Flex>
	);
};
