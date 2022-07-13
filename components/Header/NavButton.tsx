import { Button, ButtonProps, Link } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
	href: string;
}

export const NavButton: FunctionComponent<IButtonProps> = props => {
	const { href, children, ...rest } = props;
	return (
		<Link href={href} _hover={{ textDecoration: "none" }}>
			<Button
				fontSize="md"
				fontWeight="semibold"
				bgColor="transparent"
				opacity="0.75"
				borderRadius="70px"
				transition="0.4s"
				_hover={{
					bgColor: "#0B172C",
					opacity: 1,
					borderRadius: "70px",
				}}
				_active={{}}
				px="6"
				py="2"
				{...rest}
			>
				{children}
			</Button>
		</Link>
	);
};
