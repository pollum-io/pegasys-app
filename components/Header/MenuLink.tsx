import {
	ButtonProps,
	Flex,
	IconButton,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverTrigger,
} from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaParachuteBox } from "react-icons/fa";
import { AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";
import { usePicasso } from "hooks";
import {
	MdOutlineCallMade,
	MdOutlineCheckBox,
	MdOutlineContentCopy,
} from "react-icons/md";
import { RiGithubLine } from "react-icons/ri";
import { InfoDropdown } from "components/Buttons";
import { InfoLinks } from "./InfoLinks";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const MenuLinks: FunctionComponent<IButtonProps> = props => {
	const theme = usePicasso();

	const infos = [
		{
			name: "Charts",
			link: "/",
			icon: <MdOutlineCallMade />,
		},
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
			link: "/airdrop",
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
				_focus={{
					outline: "none",
				}}
				w={["100vw", "100vw", "max-content", "max-content"]}
				bgColor={theme.bg.blueNavy}
				borderBottomRadius={["none", "none", "xl", "xl"]}
				borderTopRadius={["2xl", "2xl", "xl", "xl"]}
				p="0"
				top={["3.5rem", "3.3rem", "0", "0"]}
			>
				<PopoverBody
					display="flex"
					flexDirection="column"
					zIndex="99"
					py={["10", "10", "2", "2"]}
					px="0"
				>
					<Flex flexDirection="column">
						<InfoDropdown />
					</Flex>
					<Flex
						flexDirection="column"
						pl={["24", "36", "4", "4"]}
						pr={["24", "36", "4", "4"]}
					>
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
