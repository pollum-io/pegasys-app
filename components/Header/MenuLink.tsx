import {
	ButtonProps,
	Flex,
	IconButton,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
} from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FiTwitter } from "react-icons/fi";
import { FaDiscord, FaParachuteBox, FaTelegramPlane } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { usePicasso } from "hooks";
import { MdOutlineCheckBox, MdOutlineContentCopy } from "react-icons/md";
import { RiGithubLine } from "react-icons/ri";
import { InfoLinks } from "./InfoLinks";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const MenuLinks: FunctionComponent<IButtonProps> = props => {
	const theme = usePicasso();

	const infos = [
		{
			name: "About",
			link: "https://pegasys.finance/",
			icon: <AiOutlineInfoCircle />,
		},
		{
			name: "Vote",
			link: "/vote",
			icon: <MdOutlineCheckBox />,
		},
		{
			name: "Airdrop",
			link: "https://pegasys.finance/",
			icon: <FaParachuteBox />,
		},
		{
			name: "Docs",
			link: "https://pegasys.finance/",
			icon: <MdOutlineContentCopy />,
		},
		{
			name: "Github",
			link: "https://pegasys.finance/",
			icon: <RiGithubLine />,
		},
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
		<Popover>
			<PopoverTrigger {...props}>
				<IconButton
					aria-label="Popover"
					icon={<BsThreeDots />}
					transition="0.4s"
					bg="transparent"
					_hover={{ background: theme.bg.iconBg }}
				/>
			</PopoverTrigger>
			<PopoverContent
				w="max-content"
				bgColor={theme.bg.blueNavy}
				borderRadius="xl"
				px="0.938rem"
				py="0.938rem"
				bg="red"
			>
				<PopoverArrow bgColor={theme.bg.blueNavy} />
				<PopoverBody display="flex" flexDirection="column" zIndex="99">
					<Flex flexDirection="column">
						{infos.map((links, index) => (
							<Flex
								alignItems="center"
								flexDirection="row"
								key={links.name + Number(index)}
							>
								<Flex>{links.icon}</Flex>
								<InfoLinks
									pb="1"
									isVote={links.name === "Vote"}
									href={links.link}
									_hover={{
										color: theme.text.cyanPurple,
									}}
								>
									{links.name}
								</InfoLinks>
							</Flex>
						))}
					</Flex>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};
