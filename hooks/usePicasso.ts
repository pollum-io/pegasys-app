import { useColorModeValue } from "@chakra-ui/react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";

const usePicasso = () => {
	const theme = {
		text: {
			header: useColorModeValue("#A0AEC0", "white"),
			whitePurple: useColorModeValue("#665EE1", "whitw"),
			cyanWhite: useColorModeValue("white", "#00d9ef"),
			topHeaderButton: useColorModeValue("#665EE1", "#081120"),
			cyanPurple: useColorModeValue("#665EE1", "#00d9ef"),
			mono: useColorModeValue("#1A202C", "white"),
			navItem: useColorModeValue("#4A5568", "#EDF2F7"),
			blue: useColorModeValue("white", "cyan.300"),
			infoLink: useColorModeValue("#565a69", "#c3c5cb"),
			connectWallet: useColorModeValue("#665EE1", "#00d9ef"),
			swapInfo: useColorModeValue("#565a69", "#c3c5cb"),
			whiteCyan: useColorModeValue("#ffffff", "#00d9ef"),
			cyan: useColorModeValue("#ffffff", "#00d9ef"),
			redError: useColorModeValue("#ff2532a3", "#ff2532a3"),
			gray: useColorModeValue("gray.400", "gray.400"),
			gray600: useColorModeValue("gray.600", "gray.600"),
			gray500: useColorModeValue("gray.500", "gray.500"),
			gray300: useColorModeValue("gray.300", "gray.300"),
			green400: useColorModeValue("green.400", "green.400"),
			psysBalance: useColorModeValue(
				"linear-gradient(90deg, #19EBCE 0%, #8A15E6 84.28%);",
				"linear-gradient(90deg, #19EBCE 0%, #8A15E6 84.28%);"
			),
			red400: useColorModeValue("red.400", "red.400"),
		},
		icon: {
			theme: useColorModeValue(BsFillSunFill, BsFillMoonFill),
		},
		bg: {
			topHeader: useColorModeValue("#FFFFFF", "#000000"),
			primary: useColorModeValue("#EDF2F7", "#000913"),
			secondary: useColorModeValue("gray.300", "gray.800"),
			bgPrimary: useColorModeValue("#f7f8fa", "#2c2f36"),
			whiteGray: useColorModeValue("#665EE1", "rgba(8, 17, 32, 1)"),
			iceGray: useColorModeValue("#f7f8fa", "#2c2f36"),
			blackAlpha: useColorModeValue("#ffffff", "#081120"),
			blueNavy: useColorModeValue("#F7FAFC", "rgba(11, 23, 44, 1)"),
			blue100: useColorModeValue("blue.100", "blue.100"),
			blue900: useColorModeValue("blue.900", "blue.900"),
			blueNavyLightness: useColorModeValue("#665EE1", "rgba(21, 61, 111, 1);"),
			button: {
				primary: useColorModeValue("blue.500", "blue.600"),
				secondary: useColorModeValue("purple.700", "purple.600"),
				tertiary: useColorModeValue("green.600", "blue.800"),
				connectWallet: useColorModeValue(
					"linear-gradient(90deg, #665EE1 9.38%, rgba(0, 184, 255, 0.3) 128.42%)",
					"linear-gradient(90deg, #53D9D9 9.38%, rgb(0 184 255 / 35%) 128.42%)"
				),
				connectWalletSwap: useColorModeValue("#665EE1", "rgba(21, 61, 111, 1)"),
				slippageSetting: useColorModeValue("#ffffff", "#212429"),
				sysBalance: useColorModeValue(
					"#315df6",
					"linear-gradient(128.17deg, rgb(49, 93, 246) -14.78%, rgba(49, 93, 246, 0.2) 110.05%)"
				),
				network: useColorModeValue(
					"#315df6",
					"linear-gradient(128.17deg, rgb(49, 93, 246) -14.78%, rgba(49, 93, 246, 0.2) 110.05%)"
				),
				userAddress: useColorModeValue(
					"linear-gradient(128.17deg, rgb(83, 217, 217) -14.78%, rgb(0, 184, 255) 110.05%)",
					"linear-gradient(128.17deg, rgb(83, 217, 217) -14.78%, rgba(0, 184, 255, 0.1) 110.05%)"
				),
				swapBlue: useColorModeValue("#00d9ef", "#153d6f70"),
				swapTokenCurrency: useColorModeValue("#F7F8FA", "#2C2F36"),
				switchNetwork: useColorModeValue("#04d3c0", "#153d6f70"),
			},
		},
		border: {
			modalBorderShadow: useColorModeValue(
				"0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.2);",
				"0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px 15px 40px rgba(0, 0, 0, 0.4);"
			),
			headerBorderShadow: useColorModeValue(
				"0px -5px 15px -5px rgba(102, 94, 225, 0.3)",
				"0px -10px 25px -5px rgba(86, 190, 216, 0.05);"
			),
			headerBorder: useColorModeValue(
				"1px solid rgba(102, 94, 225, 0.25);",
				"1px solid rgba(86, 190, 216, 0.15);"
			),
			connectWallet: useColorModeValue("#04d3c0", "#153d6f70"),
			borderSettings: useColorModeValue("#edeef2", "#40444f"),
			blueSys: useColorModeValue("#315df6", "#315df6"),
			swapInput: useColorModeValue("#f7f8fa", "#2c2f36"),
			wallets: useColorModeValue("#edeef2", "#40444f"),
			redError: useColorModeValue("#ff2532a3", "#ff2532a3"),
		},
	};

	return theme;
};

export { usePicasso };
