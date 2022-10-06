import { Button, ButtonProps } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { usePicasso } from "hooks";
import { useRouter } from "next/router";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
	href: string;
	active?: boolean;
}

export const NavButton: FunctionComponent<IButtonProps> = props => {
	const { push } = useRouter();
	const { href, children, display, active } = props;
	const theme = usePicasso();

	return (
		<Button
			color={active ? "white" : theme.icon.whiteGray}
			fontSize={["0.938rem", "md", "md", "md"]}
			fontWeight="semibold"
			bgColor={active ? theme.bg.alphaPurple : "transparent"}
			opacity="1"
			borderRadius="70px"
			transition="0.4s"
			_hover={{
				opacity: "0.9",
			}}
			_active={{}}
			px={[3.5, 6, 6, 6]}
			py="2"
			display={display}
			onClick={() => push(href)}
		>
			{children}
		</Button>
	);
};
