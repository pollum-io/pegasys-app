import { Button, ButtonProps } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode } from "react";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
	href: string;
	active?: boolean;
	customTarget?: boolean;
}

export const NavButton: FunctionComponent<IButtonProps> = props => {
	const { push } = useRouter();
	const { href = "", children, display, active, customTarget } = props;
	const theme = usePicasso();

	const handleClick = (e: { preventDefault: () => void }) => {
		if (href === "" || href === "#") {
			e.preventDefault();
		} else if (customTarget) {
			window.open(href, "_blank");
		} else {
			push(href);
		}
	};

	return (
		<Button
			color={active ? "white" : theme.icon.whiteGray}
			fontSize={["0.938rem", "md", "md", "md", "md"]}
			fontWeight="semibold"
			bgColor={active ? theme.bg.alphaPurple : "transparent"}
			opacity="1"
			borderRadius="70px"
			transition="0.4s"
			_hover={{
				opacity: "0.9",
			}}
			_active={{}}
			px={[3.5, 6, 6, 6, 6]}
			py="2"
			display={display}
			onClick={handleClick}
		>
			{children}
		</Button>
	);
};
