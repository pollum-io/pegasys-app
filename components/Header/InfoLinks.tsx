import { LinkProps, Button } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { usePicasso } from "hooks";

interface ILinkProps extends LinkProps {
	children?: ReactNode;
	isVote?: boolean;
	isInternal: boolean;
}

export const InfoLinks: FunctionComponent<ILinkProps> = props => {
	const theme = usePicasso();

	const { children, isVote, pb, href, isInternal } = props;

	const handleClick = () => {
		if (!isInternal) return window.open(href);

		return window.open(href, "_self");
	};

	return (
		<Button
			fontSize="md"
			fontWeight="normal"
			color={theme.text.mono}
			px={["2", "2", "2", "2"]}
			py={["3", "2", "2", "2"]}
			_hover={{ color: theme.text.cyanPurple }}
			background="transparent"
			h="max-content"
			pb={pb}
			onClick={() => handleClick()}
		>
			{children}
		</Button>
	);
};
