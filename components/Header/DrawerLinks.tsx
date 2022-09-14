import { Button, ButtonProps } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { usePicasso } from "hooks";
import { useRouter } from "next/router";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
	href: string;
	active?: boolean;
}

export const DrawerLinks: FunctionComponent<IButtonProps> = props => {
	const { push } = useRouter();
	const { href, children, active } = props;
	const theme = usePicasso();

	return (
		<Button
			color={active ? theme.text.cyanPurple : theme.text.gray800White}
			bgColor={active ? theme.bg.hamburgerMenu : "transparent"}
			borderLeftRadius="full"
			w="100%"
			transition="0.4s"
			onClick={() => push(href)}
			_hover={{}}
			_active={{ background: "transparent" }}
			_focus={{ color: theme.text.cyanPurple }}
			justifyContent="flex-start"
			alignItems="center"
			pl="7"
			m="0"
			fontWeight={active ? "medium" : "normal"}
		>
			{children}
		</Button>
	);
};
