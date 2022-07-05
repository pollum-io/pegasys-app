import { Link, LinkProps } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { usePicasso } from "hooks";

interface ILinkProps extends LinkProps {
	children?: ReactNode;
}

export const InfoLinks: FunctionComponent<ILinkProps> = props => {
	const theme = usePicasso();
	const { children, ...rest } = props;

	return (
		<Link
			fontSize="md"
			fontWeight="normal"
			color={theme.text.mono}
			p="2"
			isExternal
			_hover={{ color: theme.text.cyan }}
			{...rest}
		>
			{children}
		</Link>
	);
};
