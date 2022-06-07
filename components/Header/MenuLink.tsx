import {
	ButtonProps,
	Flex,
	IconButton,
	Popover,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverTrigger,
} from '@chakra-ui/react';
import { FunctionComponent, ReactNode } from 'react';
import { BsThreeDots, BsCheck2Square } from 'react-icons/bs';
import { FiTwitter } from 'react-icons/fi';
import { FaDiscord, FaTelegramPlane } from 'react-icons/fa';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { usePicasso } from 'hooks';
import { InfoLinks } from './InfoLinks';

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const MenuLinks: FunctionComponent<IButtonProps> = props => {
	const theme = usePicasso();

	const infos = [
		{
			name: 'About',
			link: 'https://pegasys.finance/',
			icon: <AiOutlineInfoCircle />,
		},
		{
			name: 'Discord',
			link: 'https://discord.com/invite/UzjWbWWERz',
			icon: <FaDiscord />,
		},
		{
			name: 'Telegram',
			link: 'https://t.me/joinchat/GNosBd1_76E5MTVh',
			icon: <FaTelegramPlane />,
		},
		{
			name: 'Twitter',
			link: 'https://twitter.com/PegasysDEX',
			icon: <FiTwitter />,
		},
		{
			name: 'Vote',
			link: 'https://pegasys.finance/',
			icon: <BsCheck2Square />,
		},
	];

	return (
		<Popover>
			<PopoverTrigger {...props}>
				<IconButton aria-label="Popover" icon={<BsThreeDots />} />
			</PopoverTrigger>
			<PopoverContent w="max-content" mr="2" bgColor={theme.bg.bgPrimary}>
				<PopoverCloseButton />
				<PopoverBody display="flex" flexDirection="column">
					<Flex flexDirection="column">
						{infos.map((links, index) => (
							<Flex
								alignItems="center"
								flexDirection="row"
								key={links.name + Number(index)}
							>
								<Flex>{links.icon}</Flex>
								<InfoLinks href={links.link}>{links.name}</InfoLinks>
							</Flex>
						))}
					</Flex>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};
