import { Flex } from '@chakra-ui/react';
import { Header } from 'components';
import { Swap } from 'components';
import { usePicasso } from 'hooks';
import { FunctionComponent, ReactNode } from 'react';

interface BaseLayoutProps {
	children?: ReactNode;
}

export const DefaultTemplate: FunctionComponent<BaseLayoutProps> = ({
	children,
}) => {
	const theme = usePicasso();
	return (
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
	);
};
