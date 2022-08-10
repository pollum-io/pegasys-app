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
					background={[
						`linear-gradient(transparent, #0000005) padding-box, linear-gradient(32deg, rgb(86 190 216 / 97%) 30.76%, rgb(86 190 216 / 6%) 97.76%) border-box`,
						`linear-gradient(${theme.bg.expertMode}, ${theme.bg.expertMode}) padding-box, linear-gradient(32deg, rgb(86 190 216 / 97%) 30.76%, rgb(86 190 216 / 6%) 97.76%) border-box`,
					]}
					border="1px solid transparent"
					borderTop={["1px solid transparent", "none", "none", "none"]}
					borderBottomRadius={["2xl", "2xl", "2xl", "2xl"]}
					borderTopRadius={["2xl", "unset", "unset", "unset"]}
					w="max-content"
					px="2.5rem"
					pt="4"
					ml={["0rem", "1.1rem", "1.1rem", "1.1rem"]}
					bottom={["3rem", "1.5rem", "1.5rem", "1.5rem"]}
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
