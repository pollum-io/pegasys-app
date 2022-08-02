import {
	Button,
	ButtonProps,
	Flex,
	Icon,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, ReactNode } from "react";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import {
	MdExpandMore,
	MdKeyboardArrowRight,
	MdOutlineCallMade,
	MdOutlineModeComment,
} from "react-icons/md";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const SocialButton: FunctionComponent<IButtonProps> = props => {
	const { children, ...rest } = props;
	const theme = usePicasso();

	const infos = [
		{
			name: "Discord",
			link: "https://discord.com/invite/UzjWbWWERz",
			icon: <FaDiscord />,
		},
		{
			name: "Telegram",
			link: "https://t.me/joinchat/GNosBd1_76E5MTVh",
			icon: <FaTelegramPlane />,
		},
		{
			name: "Twitter",
			link: "https://twitter.com/PegasysDEX",
			icon: <FiTwitter />,
		},
	];

	return (
		<Flex>
			<Menu>
				<Flex alignItems="center" _hover={{ color: theme.text.cyan }}>
					<Icon as={MdOutlineModeComment} />
					<MenuButton
						as={Button}
						bgColor="transparent"
						fontSize="md"
						fontWeight="normal"
						alignItems="center"
						color={theme.text.mono}
						pl="2"
						m="0"
						_hover={{ color: theme.text.cyan }}
						_active={{ bgColor: "transparent" }}
						{...rest}
					>
						Social
						<Icon
							as={MdKeyboardArrowRight}
							position="relative"
							top="1.5"
							left="14"
							mr="2"
							w="5"
							h="5"
						/>
					</MenuButton>
				</Flex>
				<MenuList
					zIndex="2"
					bgColor={theme.bg.blueNavy}
					p="4"
					borderRadius="xl"
					position="fixed"
					left="115px"
					top="-48px"
					border="none"
					w="max-content"
					minWidth="30%"
				>
					{infos.map((links, index) => (
						<MenuItem
							_hover={{ bgColor: "transparent", color: theme.text.cyan }}
							key={links.name + Number(index)}
						>
							<Flex pr="2">{links.icon}</Flex>
							<Link
								href="https://app.multichain.org/#/router"
								target="_blank"
								_hover={{ textDecoration: "none", bgColor: "transparent" }}
								_active={{ bgColor: "transparent" }}
							>
								{links.name}
							</Link>
						</MenuItem>
					))}
				</MenuList>
			</Menu>
		</Flex>
	);
};
