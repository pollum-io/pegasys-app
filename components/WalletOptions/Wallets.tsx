import { Button, Flex, Img } from "@chakra-ui/react";
import { usePicasso, useWallet } from "hooks";
import React, { useEffect } from "react";

interface IWalletProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onClick?: any;
	header: React.ReactNode;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: any;
	id: string;
}

export const Wallets = ({ id, header, icon, onClick }: IWalletProps) => {
	const theme = usePicasso();
	const { connecting, setConnecting } = useWallet();

	useEffect(() => {
		console.log(connecting);
	}, [connecting]);

	return (
		<Button
			onClick={() => onClick(setConnecting(!connecting))}
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
			borderColor={theme.border.wallets}
			_hover={{ borderColor: theme.text.cyanPsys }}
			fontWeight={500}
			id={id}
			fontFamily="inter"
		>
			<Flex>{header}</Flex>
			<Img src={icon} w="6" />
		</Button>
	);
};
