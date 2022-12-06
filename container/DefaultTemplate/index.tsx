import { Flex, useColorMode } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { Header } from "components";
import { usePicasso } from "hooks";

interface BaseLayoutProps {
	children?: ReactNode;
	heightValue?: string;
	widthValue?: string;
	alignItemsValue?: string;
}

export const DefaultTemplate: FunctionComponent<BaseLayoutProps> = ({
	children,
	heightValue,
	widthValue,
	alignItemsValue = "center",
}) => {
	const theme = usePicasso();
	const { colorMode } = useColorMode();

	return (
		<Flex
			bgColor={theme.bg.primary}
			flexDirection="column"
			style={{
				minHeight: heightValue,
				width: widthValue,
			}}
			alignItems={alignItemsValue}
		>
			<Flex
				width="100%"
				height={["100%", "100%", "40%", "40%"]}
				margin="0 auto"
				top={["-20rem", "-20rem", "-5rem", "-5rem"]}
				position="fixed"
				background={
					colorMode === "dark"
						? "radial-gradient(ellipse at center, #56BED8, #010101)"
						: "radial-gradient(ellipse at center, #68e1ffbe, #e6faff)"
				}
				filter="blur(175px)"
			/>
			{colorMode === "dark" ? (
				<Flex>
					{colorMode === "dark" ? (
						<Flex>
							<div id="starsLightMode" />
							<div id="starsLightMode2" />
							<div id="starsLightMode3" />
						</Flex>
					) : (
						<Flex>
							<div id="stars" />
							<div id="stars2" />
							<div id="stars3" />
						</Flex>
					)}
				</Flex>
			) : (
				<Flex>
					<div id="stars" />
					<div id="stars2" />
					<div id="stars3" />
				</Flex>
			)}

			<Header />
			<Flex
				id="footer-blur"
				w="100vw"
				h="9%"
				position="fixed"
				bottom={["25", "25", "-5", "-5"]}
				background={colorMode === "dark" ? "#03060c" : "#ffffff"}
				zIndex="40"
				filter="blur(35px)"
			/>
			{children}
		</Flex>
	);
};
