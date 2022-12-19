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
	useColorMode,
	useMediaQuery,
} from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaParachuteBox } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useModal, usePicasso } from "hooks";
import {
	MdOutlineAssignment,
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
	const { colorMode } = useColorMode();
	const [isMobile] = useMediaQuery("(max-width: 480px)");

	const infos = [
		{
			name: "Airdrop",
			link: "/airdrop",
			icon: <FaParachuteBox />,
		},
		{
			name: "Vote",
			link: "/vote",
			icon: <MdOutlineCheckBox />,
		},
		{
			name: "Charts",
			link: "https://info.pegasys.finance/home",
			icon: <MdOutlineCallMade />,
		},
	];

	const infos2 = [
		{
			name: "Github",
			link: "https://github.com/Pollum-io/pegasys-protocol",
			icon: <RiGithubLine />,
		},
		{
			name: "Docs",
			link: "https://docs.pegasys.finance/",
			icon: <MdOutlineContentCopy />,
		},
		{
			name: "Terms",
			link: "https://pegasys.finance/terms-of-service",
			icon: <MdOutlineAssignment />,
		},
		{
			name: "About",
			link: "https://pegasys.finance/",
			icon: <AiOutlineInfoCircle />,
		},
	];

	return (
		<Popover
			isOpen={isOpenMenuLinks}
			onOpen={onOpenMenuLinks}
			onClose={onCloseMenuLinks}
			arrowSize={15}
			arrowShadowColor="transparent"
		>
			<PopoverTrigger {...props}>
				<IconButton
					bgColor="transparent"
					color={theme.icon.nightGray}
					aria-label="Popover"
					icon={<BsThreeDots size="20px" />}
					transition="0.4s"
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
				borderBottomRadius={["none", "xl", "xl", "xl"]}
				borderTopRadius={["30px", "xl", "xl", "xl"]}
				pt="2"
				pb={["3.5rem", "0", "0", "0"]}
				mr={["0", "4", "0", "0"]}
				mb={["0", "0.3rem", "0.3rem", "0.3rem"]}
				border="none"
				borderTop={
					colorMode === "dark"
						? ["1px solid transparent", "none", "none", "none"]
						: ["none", "none", "none", "none"]
				}
				background={
					colorMode === "dark"
						? `linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(270.16deg, rgba(24,54,61, 0.8) 90.76%, rgba(24,54,61, 0) 97.76%) border-box`
						: theme.bg.blueNavyLight
				}
				boxShadow={
					isMobile
						? "2px 4px 6px 2px rgba(0, 0, 0, 0.1), 2px 2px 4px 2px rgba(0, 0, 0, 0.06)"
						: "2px 4px 6px -1px rgba(0, 0, 0, 0.1), 2px 2px 4px -1px rgba(0, 0, 0, 0.06)"
				}
				top={["5.5rem", "0", "0", "0"]}
				position="relative"
			>
				<PopoverArrow
					bg={theme.bg.blueNavyLight}
					display={["none", "flex", "flex", "flex"]}
					ml={["0", "0.47rem", "0", "0"]}
				/>
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
					px="0"
					py={["0", "1", "1", "1"]}
				>
					<Flex
						flexDirection="column"
						pl={["5.49rem", "4", "4", "4"]}
						pr={["24", "4", "4", "4"]}
					>
						{infos.map((links, index) => (
							<Flex
								key={links.name + Number(index)}
								alignItems="center"
								flexDirection="row"
								pb="1"
								_hover={{ color: theme.text.cyanPurple }}
							>
								<InfoLinks
									isInternal={links.name === "Airdrop" || links.name === "Vote"}
									isVote={links.name === "Vote"}
									href={links.link}
								>
									<Flex pr={["0.55rem", "0.5rem", "0.5rem", "0.5rem"]}>
										{links.icon}
									</Flex>
									{links.name}
								</InfoLinks>
							</Flex>
						))}
					</Flex>
					<Flex flexDirection="column">
						<InfoDropdown />
					</Flex>
					<Flex
						flexDirection="column"
						pl={["5.49rem", "4", "4", "4"]}
						pr={["24", "4", "4", "4"]}
					>
						{infos2.map((links, index) => (
							<Flex
								key={links.name + Number(index)}
								alignItems="center"
								flexDirection="row"
								pb="1"
								_hover={{ color: theme.text.cyanPurple }}
							>
								<InfoLinks
									isInternal={links.name === "Airdrop" || links.name === "Vote"}
									isVote={links.name === "Vote"}
									href={links.link}
								>
									<Flex pr={["0.55rem", "0.5rem", "0.5rem", "0.5rem"]}>
										{links.icon}
									</Flex>
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
