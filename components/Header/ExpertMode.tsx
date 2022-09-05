import { Flex, Img, Text, useMediaQuery } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { usePicasso, useWallet } from "hooks";

export const ExpertMode: FunctionComponent = () => {
	const theme = usePicasso();
	const { expert } = useWallet();
	const [isMobile] = useMediaQuery("(max-width: 480px)");

	return (
		<Flex>
			{expert && (
				<Flex
					position="fixed"
					fontSize="12px"
					zIndex="-99"
					background={[
						`linear-gradient(#010313, #010313) padding-box, linear-gradient(92deg, rgba(0, 183, 255, 0) 0%, #53D9D9 128.42%) border-box`,
						`linear-gradient(${theme.bg.expertMode}, ${theme.bg.expertMode}) padding-box, linear-gradient(1deg, rgb(86 190 216 / 97%) 30.76%, rgb(86 190 216 / 6%) 97.76%) border-box`,
					]}
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
					borderTopRadius={["2xl", "unset", "unset", "unset"]}
					w="max-content"
					h={["2.2rem", "max-content", "max-content", "max-content"]}
					px={["4", "2.5rem", "2.5rem", "2.5rem"]}
					pt={["0", "4", "4", "4"]}
					ml={["0.3rem", "1rem", "1rem", "1rem"]}
					bottom={["3.1rem", "1.5rem", "1.5rem", "1.5rem"]}
					color={theme.text.mono}
					alignItems="center"
				>
					<Text fontWeight="light" fontSize="xs">
						Expert mode
					</Text>
				</Flex>
			)}
			{expert && (
				<Flex
					display={["flex", "none", "none", "none"]}
					id="flex"
					minWidth="2rem"
					w="7rem"
				>
					<Img
						src={theme.icon.borderExpertMode}
						position="absolute"
						px="6rem"
						bottom="3rem"
						h="63%"
					/>
					<Text
						fontWeight="light"
						fontSize="xs"
						position="relative"
						bottom="2.3rem"
						left="7.5rem"
					>
						Expert mode
					</Text>
				</Flex>
			)}
		</Flex>
	);
};
