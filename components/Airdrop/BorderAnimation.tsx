import { Flex } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { usePicasso } from "hooks";

interface ILinkProps {
	children?: ReactNode;
}

export const BorderAnimation: FunctionComponent<ILinkProps> = props => {
	const theme = usePicasso();
	const { children } = props;

	return (
		<Flex
			className="gradientBorder"
			zIndex="9"
			w={["xs", "md", "2xl", "2xl"]}
			py="12"
			gap="2.5"
			bgColor={theme.bg.whiteGray}
			justifyContent="center"
			borderBottomRadius="2xl"
		>
			{children}
		</Flex>
	);
};
