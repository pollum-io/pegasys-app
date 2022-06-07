import { Flex, Img, Link } from '@chakra-ui/react';
import { usePicasso } from 'hooks';
import React from 'react';

interface IWalletProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onClick?: (() => void) | any;
	header: React.ReactNode;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: any;
	id: string;
	href?: string;
}

export const Wallets = ({ id, header, icon, onClick, href }: IWalletProps) => {
	const theme = usePicasso();

	return (
		<Link href={href || '/'}>
			<Flex
				justifyContent="space-between"
				w="100%"
				mx="0"
				my="2"
				p="4"
				border="1px solid"
				borderRadius="10"
				fontSize="md"
				borderColor={theme.border.wallets}
				_hover={{ borderColor: theme.text.cyan }}
				fontWeight={500}
				id={id}
				onClick={onClick}
			>
				<Flex>{header}</Flex>
				<Img src={icon} w="6" />
			</Flex>
		</Link>
	);
};
