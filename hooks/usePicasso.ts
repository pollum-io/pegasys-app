import { useColorModeValue } from "@chakra-ui/react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";

const usePicasso = () => {
	const theme = {
		text: {
			mono: useColorModeValue("gray.700", "white"),
			blue: useColorModeValue("white", "cyan.300"),
			infoLink: useColorModeValue("#565a69", "#c3c5cb"),
			connectWallet: useColorModeValue("#ffffff", "#00d9ef"),
			swapInfo: useColorModeValue("#565a69", "#c3c5cb"),
			whiteCyan: useColorModeValue("#ffffff", "#00d9ef"),
			cyan: useColorModeValue("#00d9ef", "#00d9ef"),
			redError: useColorModeValue("#ff2532a3", "#ff2532a3"),
			gray: useColorModeValue("gray.400", "gray.400"),
			gray500: useColorModeValue("gray.500", "gray.500"),
			gray300: useColorModeValue("gray.300", "gray.300"),
			psysBalance: useColorModeValue(
				"linear-gradient(90deg, #19EBCE 0%, #8A15E6 84.28%);",
				"linear-gradient(90deg, #19EBCE 0%, #8A15E6 84.28%);"
			),
		},
		icon: {
			theme: useColorModeValue(BsFillSunFill, BsFillMoonFill),
		},
		bg: {
			primary: useColorModeValue("blackAlpha.50", "#000913"),
			secondary: useColorModeValue("gray.300", "gray.800"),
			bgPrimary: useColorModeValue("#f7f8fa", "#2c2f36"),
			whiteGray: useColorModeValue("#ffffff", "rgba(8, 17, 32, 1)"),
			iceGray: useColorModeValue("#f7f8fa", "#2c2f36"),
			blackAlpha: useColorModeValue("#081120", "#081120"),
			blueNavy: useColorModeValue("rgba(11, 23, 44, 1)", "rgba(11, 23, 44, 1)"),
			button: {
				primary: useColorModeValue("blue.500", "blue.600"),
				secondary: useColorModeValue("purple.700", "purple.600"),
				tertiary: useColorModeValue("green.600", "blue.800"),
				connectWallet: useColorModeValue(
					"linear-gradient(90deg, #53D9D9 9.38%, rgb(0 184 255 / 35%) 128.42%)",
					"linear-gradient(90deg, #53D9D9 9.38%, rgb(0 184 255 / 35%) 128.42%)"
				),
				connectWalletSwap: useColorModeValue(
					"rgba(21, 61, 111, 1)",
					"rgba(21, 61, 111, 1)"
				),
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
