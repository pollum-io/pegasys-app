import React from "react";
import { Flex, Img, Text } from "@chakra-ui/react";

import { usePicasso } from "hooks";
import { EarnButton } from "../../Earn";

import { IHeaderProps } from "./dto";

const Header: React.FC<IHeaderProps> = ({
	unclaimedAmount,
	symbol,
	onClick,
}) => {
	const theme = usePicasso();

	return (
		<Flex
			id="header"
			bg={theme.bg.smoothGray}
			pt="3"
			pb="2"
			px={["8", "8", "6", "6"]}
			borderBottomRadius="2xl"
			gap="2"
		>
			<Img src="icons/pegasys.png" w="6" h="6" />
			<Text color={theme.text.whitePurple}>Earn {symbol}</Text>
			<EarnButton
				id="claim"
				py="1"
				ml="1"
				width="max-content"
				height="max-content"
				onClick={onClick}
				amount={unclaimedAmount}
				fontSize="xs"
			>
				Claim
			</EarnButton>
		</Flex>
	);
};

export default Header;
