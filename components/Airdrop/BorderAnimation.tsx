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
			w={["20rem", "md", "2xl", "2xl"]}
			py={["10", "10", "12", "12"]}
			pt={["3rem", "3rem", "4rem", "4rem"]}
			gap="2.5"
			bgColor={theme.bg.blueNavyLight}
			justifyContent="center"
			borderBottomRadius="2xl"
			px="1.7rem"
		>
			{children}
		</Flex>
	);
};
