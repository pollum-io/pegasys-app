import React from "react";
import { Flex, Img, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { usePicasso } from "hooks";
import { EarnButton } from "../../Earn";

import { IHeaderProps } from "./dto";

const Header: React.FC<IHeaderProps> = ({ stakedAmount, symbol, onClick }) => {
	const theme = usePicasso();
	const { t } = useTranslation();

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
			<Text color={theme.text.whitePurple}>
				{t("earnPages.earn")} {symbol}
			</Text>
			<EarnButton
				id="claim"
				py="1"
				ml="1"
				width="max-content"
				height="max-content"
				onClick={onClick}
				amount={stakedAmount}
				fontSize="xs"
			>
				{t("earnPages.claim")}
			</EarnButton>
		</Flex>
	);
};

export default Header;
