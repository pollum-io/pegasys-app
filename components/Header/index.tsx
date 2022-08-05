import {
	Flex,
	Icon,
	Img,
	Text,
	useColorMode,
	useDisclosure,
} from "@chakra-ui/react";
import { WalletButton } from "components";
import { IconButton } from "components/Buttons";
import { usePicasso } from "hooks";
import { MdOutlineCallMade } from "react-icons/md";
import { PsysBreakdown } from "components/Modals/PsysBreakdown";
import { NavButton } from "./NavButton";
import { NetworkButton } from "./NetworkButton";
import { TokenButton } from "./TokenButton";
import { MenuLinks } from "./MenuLink";
import { SettingsButton } from "./SettingsButton";
import { ExpertMode } from "./ExpertMode";

export const Header: React.FC = () => {
	const { toggleColorMode } = useColorMode();
	const theme = usePicasso();
	const { onOpen, isOpen, onClose } = useDisclosure();
	const links = [
		{
			name: "Swap",
			url: "/",
		},
		{
			name: "Pools",
			url: "/pools",
		},
		{
			name: "Farms",
			url: "/farms",
		},
		{
			name: "Stake",
			url: "/stake",
		},
	];

	return (
		<Flex
			p="4"
			mt="1"
			alignItems="center"
			justifyContent="center"
			flexDirection="column"
		>
			<PsysBreakdown isOpen={isOpen} onClose={onClose} />
			<Img
				w={["8", "8", "6", "6"]}
				h={["8", "8", "6", "6"]}
				src="icons/pegasys.png"
				ml={["2", "4", "4", "4"]}
				position="absolute"
				left="0"
			/>
			<Flex
				gap="1"
				bgColor={theme.bg.topHeader}
				borderRadius="20"
				ml={["8", "0", "0", "0"]}
			>
				{links.map((item, index) => (
					<NavButton key={item.name + Number(index)} href={item.url}>
						{item.name}
					</NavButton>
				))}
				<NavButton
					href="/"
					color={theme.text.header}
					display={{
						base: "none",
						sm: "none",
						md: "block",
						lg: "block",
					}}
				>
					Charts{" "}
					<Icon
						as={MdOutlineCallMade}
						w="5"
						h="5"
						ml="2"
						color={theme.text.header}
					/>
				</NavButton>
			</Flex>
			<Flex
				w={["90%", "32rem", "32rem", "32rem"]}
				h="max-content"
				backgroundColor={theme.bg.blackAlpha}
				borderRadius="46px 46px 0px 0px"
				border={theme.border.headerBorder}
				boxShadow={theme.border.headerBorderShadow}
				position="fixed"
				bottom="0"
				zIndex="99"
				alignItems="center"
				px={["0", "10"]}
				pl={["2", "10"]}
				py="2"
				justifyContent={["space-around", "space-between"]}
			>
				<Flex
					w="25%"
					gap={["2", "0"]}
					justifyContent={["space-around", "space-between"]}
				>
					<TokenButton onClick={onOpen} />
					<NetworkButton />
				</Flex>
				<Flex flexDirection="column">
					<WalletButton />
					<ExpertMode />
				</Flex>
				<Flex>
					<IconButton
						aria-label="Theme"
						icon={<theme.icon.theme />}
						onClick={() => toggleColorMode()}
					/>
					<MenuLinks />
					<SettingsButton />
				</Flex>
			</Flex>
		</Flex>
	);
};
