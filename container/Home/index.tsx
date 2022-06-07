import { Swap } from 'components';
import { DefaultTemplate } from 'container';
import { NextPage } from 'next';

export const HomeContainer: NextPage = () => (
	<DefaultTemplate>
		<Swap />
	</DefaultTemplate>
);
