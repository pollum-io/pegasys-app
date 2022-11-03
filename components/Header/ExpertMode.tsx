import { Flex, Img, Text, useColorMode } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { usePicasso, useWallet } from "hooks";

export const ExpertMode: FunctionComponent = () => {
	const theme = usePicasso();
	const { expert } = useWallet();
	const { colorMode } = useColorMode();

	return (
		<Flex>
			{expert && (
				<Flex
					position="fixed"
					fontSize="12px"
					zIndex="-99"
					background={
						colorMode === "dark"
							? [
									`linear-gradient(#010313, #010313) padding-box, linear-gradient(92deg, rgba(0, 183, 255, 0) 0%, #53D9D9 128.42%) border-box`,
									`linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(100deg, rgba(86, 190, 216, 0.8) 50.76%, rgba(86, 190, 216, 0.3) 90%) border-box`,
							  ]
							: [
									`linear-gradient(#665EE1, #665EE1) padding-box, linear-gradient(92deg, #665EE1 0%, #665EE1 128.42%) border-box`,
									`linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(100deg, rgba(102,94,225, 0.8) 50.76%, rgba(86, 190, 216, 0.8) 70%) border-box`,
							  ]
					}
					border="1px solid transparent"
					borderTop={["1px solid transparent", "none", "none", "none"]}
					borderLeft={[
						"none",
						"1px solid transparent",
						"1px solid transparent",
						"1px solid transparent",
					]}
					display={["none", "flex", "flex", "flex"]}
					borderBottomRadius={["2xl", "2xl", "2xl", "2xl"]}
					borderBottomLeftRadius={["unset", "2xl", "2xl", "2xl"]}
					borderTopRadius={["2xl", "unset", "unset", "none"]}
					w={["max-content", "10.4rem", "10.4rem", "10.4rem"]}
					h={["2.2rem", "max-content", "max-content", "max-content"]}
					px={["4", "2.5rem", "2.5rem", "2.5rem"]}
					pt={["0", "0.9rem", "0.9rem", "0.9rem"]}
					ml={["0.3rem", "1rem", "1rem", "1rem"]}
					bottom={["3.1rem", "1.5rem", "1.5rem", "1.5rem"]}
					color={theme.text.mono}
					alignItems="center"
					justifyContent="center"
				>
					<Text fontWeight="light" fontSize="xs">
						Expert mode
					</Text>
				</Flex>
			)}
			{expert && (
				<Flex display={["flex", "none", "none", "none"]} id="flex" w="7rem">
					<Img
						src={theme.icon.borderExpertMode}
						position="absolute"
						px="6rem"
						bottom="3rem"
						h="63%"
						zIndex="-99"
					/>
				</Flex>
			)}
		</Flex>
	);
};
