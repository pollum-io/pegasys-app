import { Flex } from '@chakra-ui/react';
import { Header } from 'components';
import { Web3ReactProvider } from '@web3-react/core';
import { Swap } from 'components';
import { WalletProvider } from 'contexts/wallet';
import { usePicasso } from 'hooks';
import { FunctionComponent, ReactNode } from 'react';
import getLibrary from 'utils/getLibrary';

interface BaseLayoutProps {
	children?: ReactNode;
}

export const DefaultTemplate: FunctionComponent<BaseLayoutProps> = ({
	children
}) => {
	const theme = usePicasso();
	return (
		<WalletProvider>
			<Web3ReactProvider getLibrary={getLibrary}>
				<Flex
					bgColor={theme.bg.primary}
					flexDirection={['column']}
					h="100vh"
					w="100vw"
					backgroundImage="radial-gradient(50% 50% at 50% 50%, rgba(0, 217, 239, 0.15) 0%, rgba(33, 36, 41, 0) 100%)"
				>
					<Header />
					{children}
				</Flex>
			</Web3ReactProvider>
		</WalletProvider>
	);
};
