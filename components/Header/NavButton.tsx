import { Button, ButtonProps, Link } from "@chakra-ui/react";
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
	const { href, children, color, display, active } = props;
	const theme = usePicasso();

	return (
		<Button
			color={color}
			fontSize={["0.938rem", "md", "md", "md"]}
			fontWeight="semibold"
			bgColor={active ? theme.bg.whiteGray : "transparent"}
			borderRadius="70px"
			transition="0.4s"
			_hover={{
				bgColor: theme.bg.whiteGray,
				borderRadius: "70px",
			}}
			onClick={() => push(href)}
			_active={{}}
			px={[3, 6, 6, 6]}
			py="2"
			display={display}
		>
			{children}
		</Button>
	);
};
