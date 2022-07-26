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
import { FaParachuteBox } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { usePicasso } from "hooks";
import { MdOutlineCheckBox, MdOutlineContentCopy } from "react-icons/md";
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
	];

	return (
		<Popover>
			<PopoverTrigger {...props}>
				<IconButton
					aria-label="Popover"
					icon={<BsThreeDots />}
					transition="0.4s"
					bg="transparent"
					_hover={{ background: "rgba(255, 255, 255, 0.08)" }}
				/>
			</PopoverTrigger>
			<PopoverContent
				_focus={{
					outline: "none",
				}}
				w="max-content"
				bgColor={theme.bg.blueNavy}
				borderRadius="xl"
				p="0"
			>
				<PopoverArrow bgColor={theme.bg.blueNavy} />
				<PopoverBody
					display="flex"
					flexDirection="column"
					zIndex="99"
					py="2"
					px="0"
				>
					<Flex flexDirection="column">
						<InfoDropdown />
					</Flex>
					<Flex flexDirection="column" pl="4">
						{infos.map((links, index) => (
							<Flex
								alignItems="center"
								flexDirection="row"
								key={links.name + Number(index)}
								_hover={{ color: theme.text.cyan }}
							>
								<Flex>{links.icon}</Flex>
								<InfoLinks
									pb="1"
									isVote={links.name === "Vote"}
									href={links.link}
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
