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
	const { children, pb, href, isVote } = props;

	return (
		<Button
			fontSize="md"
			fontWeight="normal"
			color={theme.text.mono}
			px={["2", "2", "2", "2"]}
			py={["3", "3", "2", "2"]}
			_hover={{ color: theme.text.cyanPurple }}
			background="transparent"
			// isExternal={!isVote}
			h="max-content"
			pb={pb}
			onClick={() => push(href as string)}
		>
			{children}
		</Button>
	);
};
