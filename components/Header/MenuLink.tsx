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
import { AiOutlineInfoCircle } from "react-icons/ai";
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
					icon={<BsThreeDots size="20px" />}
					transition="0.4s"
					bg="transparent"
					_hover={{
						color: theme.text.cyanPurple,
						background: theme.bg.iconBg,
					}}
					_expanded={{ color: theme.text.cyanPurple }}
				/>
			</PopoverTrigger>
			<PopoverContent
				_focus={{
					outline: "none",
				}}
				w={["100vw", "100vw", "max-content", "max-content"]}
				bgColor={theme.bg.blueNavyLight}
				borderBottomRadius={["none", "none", "xl", "xl"]}
				borderTopRadius={["2xl", "2xl", "xl", "xl"]}
				p="0"
				top={["3.5rem", "3.3rem", "0", "0"]}
				position="relative"
				right="0"
				border={["none", "1px solid transparent"]}
			>
				<PopoverArrow bg={theme.bg.blueNavyLight} />
				<Flex
					justifyContent="flex-end"
					zIndex="99"
					pr="0.3rem"
					pt="0.5rem"
					display={{
						base: "flex",
						sm: "flex",
						md: "none",
						lg: "none",
					}}
				>
					<PopoverCloseButton position="relative" size="md" />
				</Flex>
				<PopoverBody
					display="flex"
					flexDirection="column"
					zIndex="99"
					px="0"
					py={["0", "0", "1", "1"]}
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
								pb="1"
								key={links.name + Number(index)}
								_hover={{ color: theme.text.cyanPurple }}
							>
								<Flex pl={["0", "0", "0.5rem", "0.5rem"]}>{links.icon}</Flex>
								<InfoLinks isVote={links.name === "Vote"} href={links.link}>
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
