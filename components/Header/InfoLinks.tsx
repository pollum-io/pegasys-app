import { Link, LinkProps } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { usePicasso } from "hooks";

interface ILinkProps extends LinkProps {
	children?: ReactNode;
	isVote?: boolean;
}

export const InfoLinks: FunctionComponent<ILinkProps> = props => {
	const theme = usePicasso();
	const { children, isVote, ...rest } = props;

	return (
		<Link
			fontSize="md"
			fontWeight="normal"
			color={theme.text.mono}
			px={["2", "2", "2", "2"]}
			py={["3", "3", "2", "2"]}
			_hover={{ color: theme.text.cyan }}
			isExternal={!isVote}
			{...rest}
		>
			{children}
		</Link>
	);
};
