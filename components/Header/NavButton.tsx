import { Button, ButtonProps, Link } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { usePicasso } from "hooks";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
	href: string;
}

export const NavButton: FunctionComponent<IButtonProps> = props => {
	const { href, children, ...rest } = props;
	const theme = usePicasso();
	return (
		<Link href={href} _hover={{ textDecoration: "none" }}>
			<Button
				color={theme.text.header}
				fontSize={["0.938rem", "md", "md", "md"]}
				fontWeight="semibold"
				bgColor="transparent"
				opacity="1"
				borderRadius="70px"
				transition="0.4s"
				_hover={{
					bgColor: theme.bg.whiteGray,
					opacity: 1,
					borderRadius: "70px",
				}}
				_active={{}}
				px={[3.5, 6, 6, 6]}
				py="2"
				{...rest}
			>
				{children}
			</Button>
		</Link>
	);
};
