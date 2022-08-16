import { Flex, Link, LinkProps, Text } from "@chakra-ui/react";
import { FunctionComponent, ReactNode, useState } from "react";
import { usePicasso, useWallet } from "hooks";

export const ExpertMode: FunctionComponent = () => {
	const theme = usePicasso();
	const { expert } = useWallet();

	return (
		<Flex>
			{expert && (
				<Flex
					position="relative"
					fontSize="12px"
					zIndex="-1"
					background={[
						`linear-gradient(${theme.bg.expertMode}, ${theme.bg.expertMode}) padding-box, linear-gradient(92deg, rgba(0, 183, 255, 0) 0%, #53D9D9 128.42%) border-box`,
						`linear-gradient(${theme.bg.expertMode}, ${theme.bg.expertMode}) padding-box, linear-gradient(32deg, rgb(86 190 216 / 97%) 30.76%, rgb(86 190 216 / 6%) 97.76%) border-box`,
					]}
					border="1px solid transparent"
					borderTop={["1px solid transparent", "none", "none", "none"]}
					borderLeft={[
						"none",
						"1px solid transparent",
						"1px solid transparent",
						"1px solid transparent",
					]}
					borderBottomRadius={["2xl", "2xl", "2xl", "2xl"]}
					borderBottomLeftRadius={["unset", "2xl", "2xl", "2xl"]}
					borderTopRadius={["2xl", "unset", "unset", "unset"]}
					borderTopLeftRadius={["unset", "2xl", "2xl", "2xl"]}
					w="max-content"
					h={["2.2rem", "max-content", "max-content", "max-content"]}
					px={["4", "2.5rem", "2.5rem", "2.5rem"]}
					pt={["0", "4", "4", "4"]}
					ml={["1.5rem", "1.1rem", "1.1rem", "1.1rem"]}
					bottom={["3.1rem", "1.5rem", "1.5rem", "1.5rem"]}
					color={theme.text.mono}
					alignItems="center"
				>
					<Text fontWeight="light" fontSize="xs">
						Expert mode
					</Text>
				</Flex>
			)}
		</Flex>
	);
};
