import {
	Button,
	ButtonProps,
	Flex,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, ReactNode } from "react";
import { MdExpandMore } from "react-icons/md";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const BridgeButton: FunctionComponent<IButtonProps> = props => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { children, ...rest } = props;
	const theme = usePicasso();
	return (
		<Flex justifyContent="center" alignItems="center">
			<Menu>
				<MenuButton
					as={Button}
					rightIcon={<MdExpandMore color={theme.icon.whiteGray} />}
					_active={{}}
					_hover={{
						bgColor: theme.bg.alphaPurple,
						color: "white",
						opacity: 1,
						borderRadius: "70px",
					}}
					color={theme.icon.whiteGray}
					fontSize="md"
					fontWeight="semibold"
					bgColor="transparent"
					opacity="1"
					pl="6"
					display="flex"
					justifyContent="center"
					alignItems="center"
					lineHeight="0"
					borderRadius="70px"
					{...rest}
				>
					Bridge
				</MenuButton>
				<MenuList
					zIndex="2"
					bgColor={theme.bg.blueNavy}
					p="4"
					w="0.625rem"
					borderRadius="2xl"
					position="fixed"
					left="-1.5625rem"
					top="-0.5rem"
					minWidth="8.75rem"
					border="none"
				>
					<MenuItem
						_hover={{ bgColor: "transparent", color: theme.text.cyanPurple }}
					>
						<Link
							href="https://app.multichain.org/#/router"
							target="_blank"
							_hover={{ textDecoration: "none", bgColor: "transparent" }}
							_active={{ bgColor: "transparent" }}
						>
							Multichain
						</Link>
					</MenuItem>
					<MenuItem
						_hover={{ bgColor: "transparent", color: theme.text.cyanPurple }}
					>
						<Link
							href="https://bridge.syscoin.org/"
							target="_blank"
							_hover={{ textDecoration: "none", bgColor: "transparent" }}
							_active={{ bgColor: "transparent" }}
						>
							Syscoin
						</Link>
					</MenuItem>
				</MenuList>
			</Menu>
		</Flex>
	);
};
