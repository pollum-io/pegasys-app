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
import { useModal, usePicasso } from "hooks";
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
	const { isOpenMenuLinks, onCloseMenuLinks, onOpenMenuLinks } = useModal();

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
		<Popover
			isOpen={isOpenMenuLinks}
			onOpen={onOpenMenuLinks}
			onClose={onCloseMenuLinks}
		>
			<PopoverTrigger {...props}>
				<IconButton
					color={theme.icon.nightGray}
					aria-label="Popover"
					icon={<BsThreeDots size="20px" />}
					transition="0.4s"
					bg="transparent"
					_hover={{
						color: theme.text.cyanPurple,
					}}
					_expanded={{ color: theme.text.cyanPurple }}
				/>
			</PopoverTrigger>
			<PopoverContent
				_focus={{
					outline: "none",
				}}
				w={["100vw", "max-content", "max-content", "max-content"]}
				bgColor={theme.bg.blueNavyLight}
				borderBottomRadius={["none", "xl", "xl", "xl"]}
				borderTopRadius={["2xl", "xl", "xl", "xl"]}
				pt="2"
				mr={["0", "4", "0", "0"]}
				border={["none", "1px solid transparent"]}
				top={["3.5rem", "0", "0", "0"]}
				position="relative"
			>
				<PopoverArrow bg={theme.bg.blueNavyLight} />
				<Flex
					justifyContent="flex-end"
					pr="0.3rem"
					pt="0.5rem"
					display={{
						base: "flex",
						sm: "none",
						md: "none",
						lg: "none",
					}}
				>
					<PopoverCloseButton position="relative" size="md" />
				</Flex>
				<PopoverBody
					display="flex"
					flexDirection="column"
					zIndex="9999"
					px="0"
					py={["0", "1", "1", "1"]}
				>
					<Flex flexDirection="column">
						<InfoDropdown />
					</Flex>
					<Flex
						flexDirection="column"
						pl={["24", "4", "4", "4"]}
						pr={["24", "4", "4", "4"]}
					>
						{infos.map((links, index) => (
							<Flex
								alignItems="center"
								flexDirection="row"
								pb="1"
								key={links.name + Number(index)}
								_hover={{ color: theme.text.cyanPurple }}
							>
								<Flex pl={["0", "0.5rem", "0.5rem", "0.5rem"]}>
									{links.icon}
								</Flex>
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
