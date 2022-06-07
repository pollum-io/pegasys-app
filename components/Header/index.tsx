import { Flex, Icon, Img, useColorMode } from '@chakra-ui/react';
import { WalletButton } from 'components';
import { FiArrowUpRight } from 'react-icons/fi';
import { NavButton } from './NavButton';
import { NetworkButton } from './NetworkButton';
import { TokenButton } from './TokenButton';
import { MenuLinks } from './MenuLink';
import { SettingsButton } from './SettingsButton';
import { UserSysBalance } from './UserSysBalance';
import { IconButton } from 'components/Buttons';
import { usePicasso } from 'hooks';

export const Header: React.FC = () => {
	const { toggleColorMode } = useColorMode();
	const theme = usePicasso();
	const links = [
		{
			name: 'Swap',
			url: '/',
		},
		{
			name: 'Pools',
			url: '/pools',
		},
		{
			name: 'Farms',
			url: '/farms',
		},
		{
			name: 'Stake',
			url: '/stake',
		},
		{
			name: 'Airdrops',
			url: '/airdrops',
		},
	];


	return (
		<Flex p="4" mt="1" justifyContent="space-between" alignItems="center">
			<Flex gap="3" alignItems="center">
				<Img w="6" h="6" src="icons/pegasys.png" mr="4" />
				{links.map((item, key) => (
					<NavButton key={key} href={item.url}>{item.name}</NavButton>
				))}
				<NavButton href="/">
					Charts{' '}
					<Icon
						as={FiArrowUpRight}
						w="3"
						h="3"
						position="absolute"
						top="-0.5"
						right="-0.5"
					/>
				</NavButton>
				<NavButton href="/">
					Bridge{' '}
					<Icon
						as={FiArrowUpRight}
						w="3"
						h="3"
						position="absolute"
						top="-0.5"
						right="-0.5"
					/>
				</NavButton>
			</Flex>
			<Flex gap="3">
				<NetworkButton />
				<TokenButton />
				<UserSysBalance />
				<WalletButton />
				<IconButton
					aria-label="Theme"
					icon={<theme.icon.theme />}
					onClick={() => toggleColorMode()}
				/>
				<SettingsButton />
				<MenuLinks />
			</Flex>
		</Flex>
	);
};
