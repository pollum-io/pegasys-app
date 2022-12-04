import { Button, Flex, Img } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { useWallet } from "pegasys-services";
import React from "react";
import { useTranslation } from "react-i18next";
import { getExtensionLink } from "utils";

interface IWalletProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onClick?: any;
	header: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: any;
	id: string;
}

export const Wallets = ({ id, header, icon, onClick }: IWalletProps) => {
	const theme = usePicasso();
	const { t: translation } = useTranslation();
	const { connecting, setConnecting, provider } = useWallet();
	const label = provider ? header : `${translation("menu.install")} ${header}`;

	return (
		<Button
			onClick={() =>
				provider
					? onClick(setConnecting(!connecting))
					: window.open(getExtensionLink())
			}
			color={theme.text.mono}
			_hover={{
				bgColor: theme.bg.button.connectToWallet,
				borderColor: theme.bg.button.connectToWallet,
			}}
			px="0"
			py="0"
			bgColor="transparent"
			_active={{}}
			h="max-content"
			justifyContent="space-between"
			w="100%"
			mx="0"
			my="2"
			p="4"
			border="1px solid"
			borderRadius="full"
			fontSize="md"
			borderColor={theme.border.smoothGray}
			fontWeight={500}
			id={id}
			fontFamily="inter"
		>
			<Flex>{label}</Flex>
			<Img src={icon} w="6" />
		</Button>
	);
};
