import { Flex, Link, LinkProps, Text } from "@chakra-ui/react";
import { FunctionComponent, ReactNode, useState } from "react";
import { usePicasso } from "hooks";

export const ExpertMode: FunctionComponent = () => {
	const theme = usePicasso();
	const [isExpertMode, setIsExportMode] = useState();

	return (
		<Flex>
			{isExpertMode && (
				<Flex
					position="fixed"
					zIndex="-1"
					background={`linear-gradient(${theme.bg.expertMode}, ${theme.bg.expertMode}) padding-box, linear-gradient(32deg, rgb(86 190 216 / 97%) 30.76%, rgb(86 190 216 / 6%) 97.76%) border-box`}
					border="1px solid transparent"
					borderTop="none"
					borderBottomRadius="2xl"
					w="max-content"
					px="2.5rem"
					pt="4"
					ml="1rem"
					bottom="1.5rem"
					color={theme.text.mono}
				>
					<Text fontWeight="light" fontSize="xs">
						Expert mode
					</Text>
				</Flex>
			)}
		</Flex>
	);
};
