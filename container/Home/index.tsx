import { Flex } from '@chakra-ui/react';
import { Header } from 'components';
import { Swap } from 'components'
import { DefaultTemplate } from 'container';
import { NextPage } from 'next';

export const HomeContainer: NextPage = () => {
	return (
		<DefaultTemplate>
			<Swap />
		</DefaultTemplate>
	);
};
