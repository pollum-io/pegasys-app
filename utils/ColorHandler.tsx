// e.g. src/Chakra.js
// a) import `ChakraProvider` component as well as the storageManagers
import React, { ReactNode, useMemo } from "react";
import {
	ChakraProvider,
	ConfigColorMode,
	cookieStorageManager,
	localStorageManager,
} from "@chakra-ui/react";
import { theme } from "styles";

// TODO Documentation
const ColorHandler = ({
	cookies,
	children,
	currentThemeToUse,
}: {
	cookies: string;
	children: ReactNode;
	currentThemeToUse: ConfigColorMode;
}) => {
	const colorModeManager =
		typeof cookies === "string"
			? cookieStorageManager(cookies)
			: localStorageManager;

	const userTheme = useMemo(
		() => ({
			...theme,
			config: {
				...theme.config,
				initialColorMode: currentThemeToUse ?? "dark",
			},
		}),
		[currentThemeToUse]
	);

	return (
		<ChakraProvider
			resetCSS
			theme={userTheme}
			colorModeManager={colorModeManager}
		>
			{children}
		</ChakraProvider>
	);
};

export { ColorHandler };
