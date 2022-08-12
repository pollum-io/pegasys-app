import { LinkProps, Button } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { usePicasso } from "hooks";
import { useRouter } from "next/router";

interface ILinkProps extends LinkProps {
	children?: ReactNode;
	isVote?: boolean;
}

export const InfoLinks: FunctionComponent<ILinkProps> = props => {
	const theme = usePicasso();
	const { push } = useRouter();
	const { children, isVote, pb, href } = props;

	return (
		<Button
			fontSize="md"
			fontWeight="normal"
			color={theme.text.mono}
			px={["2", "2", "2", "2"]}
			py={["3", "3", "2", "2"]}
			_hover={{ color: theme.text.cyan }}
			background="transparent"
			// isExternal={!isVote}
			pb={pb}
			onClick={() => push(href as string)}
		>
			{children}
		</Button>
	);
};
