import { Flex } from '@chakra-ui/react';
import { Header } from 'components';
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
		>
			<Header />
			{children}
		</Flex>
	);
};
