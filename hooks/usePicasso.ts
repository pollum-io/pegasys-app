import { useColorModeValue } from "@chakra-ui/react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";

const usePicasso = () => {
	const theme = {
		text: {
			manageInput: useColorModeValue(
				"rgba(0, 0, 0, 0.36)",
				"rgba(255, 255, 255, 0.36)"
			),
			inputValue: useColorModeValue(
				"rgba(0, 0, 0, 0.24)",
				"rgba(255, 255, 255, 0.36"
			),
			farmActionsHover: useColorModeValue("#3B3693", "#1A365D"),
			max: useColorModeValue("#2D3748", "#00D9EF"),
			input: useColorModeValue("#9F7AEA", "#36B4D4"),
			whiteGray: useColorModeValue("rgba(0, 0, 0, 0.24)", "white"),
			transactionsItems: useColorModeValue(
				"#A0AEC0",
				"rgb(255, 255, 255, 0.64)"
			),
			cyanLightPurple: useColorModeValue("#8C15E8", "#00d9ef"),
			whitePurple: useColorModeValue("#665EE1", "white"),
			topHeaderButton: useColorModeValue("#665EE1", "#081120"),
			cyanPurple: useColorModeValue("#665EE1", "#00d9ef"),
			mono: useColorModeValue("#1A202C", "white"), // text black and white
			navItem: useColorModeValue("#4A5568", "#EDF2F7"), // bottom header icons color
			blue: useColorModeValue("white", "cyan.300"),
			stakeMode: useColorModeValue("#A0AEC0", "rgba(255, 255, 255, 0.36)"),
			swapInfo: useColorModeValue("#565a69", "#c3c5cb"),
			cyan: useColorModeValue("#ffffff", "#00d9ef"),
			redError: useColorModeValue("#ff2532a3", "#ff2532a3"),
			gray: useColorModeValue("gray.400", "gray.400"),
			gray45: useColorModeValue("gray.500", "gray.400"),
			gray600: useColorModeValue("gray.600", "gray.600"),
			gray500: useColorModeValue("gray.500", "gray.500"), // balance text color
			gray300: useColorModeValue("#718096", "#CBD5E0"),
			green400: useColorModeValue("green.400", "green.400"),
			greenSocial: useColorModeValue("#67DBD8", "#67DBD8"),
			psysBalance: useColorModeValue(
				"linear-gradient(90deg, #19EBCE 0%, #8A15E6 84.28%);",
				"linear-gradient(90deg, #19EBCE 0%, #8A15E6 84.28%);"
			),
			red400: useColorModeValue("red.400", "red.400"),
			red500: useColorModeValue("red.500", "red.500"),
			whiteAlpha: useColorModeValue(
				"rgba(255,255,255, .36)",
				"rgba(255,255,255, .36)"
			),
		},
		icon: {
			infoWhiteRed: useColorModeValue("#E53E3E", "#ffffff"),
			closeWhiteGray: useColorModeValue("#718096", "#ffffff"),
			helpIcon: useColorModeValue("#A0AEC0", "rgba(255, 255, 255, 0.64)"),
			pegasysLogo: useColorModeValue(
				"icons/LightPegasysLogo.png",
				"icons/pegasys.png"
			),
			borderExpertMode: useColorModeValue(
				"icons/Border-gradient-02.png",
				"icons/Border-gradient-02.png"
			),
			searchIcon: useColorModeValue("#9F7AEA", "rgba(54, 180, 212, 0.5)"),
			whiteGray: useColorModeValue("#A0AEC0", "white"),
			theme: useColorModeValue(BsFillSunFill, BsFillMoonFill),
		},
		bg: {
			voteGray: useColorModeValue("#E2E8F0", "#081120"),
			candleGraphColor: useColorModeValue("#665EE1", "#2B6CB0"),
			bluePink: useColorModeValue("#FAF5FF", "#0B172C"),
			stakeBanner: useColorModeValue(
				"/images/backgrounds/LightBannerStake.png",
				"/images/backgrounds/BannerStake.png"
			),
			psysAirdrop: useColorModeValue(
				"/images/backgrounds/LightPsysAirdrop.png",
				"/images/backgrounds/PsysAirdrop.png"
			),
			governanceBanner: useColorModeValue(
				"/images/backgrounds/LightGovernanceBanner.png",
				"/images/backgrounds/GovernanceBanner.png"
			),
			psysReward: useColorModeValue(
				"/images/backgrounds/LightPsysReward.png",
				"/images/backgrounds/PsysReward.png"
			),
			subModal: useColorModeValue(
				"rgba(255, 255, 255, 0.92)",
				"rgba(11, 23, 44, 0.8)"
			),
			farmBanner: useColorModeValue(
				"/images/backgrounds/LightBannerFarm.png",
				"/images/backgrounds/BannerFarm.png"
			),
			poolsBanner: useColorModeValue(
				"images/backgrounds/LightBannerPool.png",
				"images/backgrounds/BannerPools.png"
			),
			poolsBannerMobile: useColorModeValue(
				"images/backgrounds/BannerPoolsMobileLightmode.png",
				"images/backgrounds/BannerPoolsMobile.png"
			),
			farmBannerMobile: useColorModeValue(
				"images/backgrounds/BannerFarmMobileLightmode.png",
				"images/backgrounds/BannerFarmMobileDarkMode.png"
			),
			stakeBannerMobile: useColorModeValue(
				"images/backgrounds/BannerStakeMobileLightmode.png",
				"images/backgrounds/BannerStakeMobileDarkmode.png"
			),
			aidropBannerMobile: useColorModeValue(
				"images/backgrounds/BannerAidropMobileLightmode.png",
				"images/backgrounds/BannerAidropMobileDarkmode.png"
			),
			farmActions: useColorModeValue("white", "#0B172C"),
			max: useColorModeValue("#EDF2F7", "#081120"),
			farmActionsHover: useColorModeValue("rgba(102, 94, 225, 0.3)", "#BEE3F8"),
			farmRate: useColorModeValue(
				"rgb(222,225,226, 0.25)",
				"rgba(255, 255, 255, 0.04)"
			),
			iconTicket: useColorModeValue(
				"rgba(0, 0, 0, 0.06)",
				"rgba(255, 255, 255, 0.06)"
			),
			slippage: useColorModeValue("#D6BCFA", "#153D6F"),
			transactionSettings: useColorModeValue("rgb(0, 0, 0, 0.04)", "#081120"),
			iconBg: useColorModeValue(
				"rgb(222,225,226, 0.4)",
				"rgba(255, 255, 255, 0.08)"
			),
			blueLightPurple: useColorModeValue("#665EE1", "#153D6F"),
			bluePurple: useColorModeValue("#8C15E8", "#0753B2"),
			topHeader: useColorModeValue(
				"rgba(255, 255, 255, 0.24)",
				"rgba(0, 0, 0, 0.24)"
			),
			primary: useColorModeValue("#EDF2F7", "#000913"),
			secondary: useColorModeValue("#FFFFFF", "#0B172C"), // tooltip background
			whiteGray: useColorModeValue("#665EE1", "rgba(8, 17, 32, 1)"), //
			blackAlpha: useColorModeValue("#ffffff", "#081120"), // modal bg
			blackLightness: useColorModeValue("#F7FAFC", "#081120"),
			blueNavy: useColorModeValue("#F7FAFC", "#0B172C"), // intern modal flexes
			blueNavyLight: useColorModeValue("#ffffff", "#0B172C"),
			blueGray: useColorModeValue("#171F2D", "#171F2D"),
			blue100: useColorModeValue("blue.100", "blue.100"),
			blue600: useColorModeValue("#2B6CB0", "#2B6CB0"),
			blue900: useColorModeValue("blue.900", "blue.900"),
			blueNavyLightness: useColorModeValue("#665EE1", "rgba(21, 61, 111, 1)"),
			blueNavyLightnessOp: useColorModeValue(
				"rgb(102,94,225, 0.8)",
				"rgba(21, 61, 111, 1)"
			),
			button: {
				connectToWallet: useColorModeValue("#EEEAF4", "#153D6F"),
				primary: useColorModeValue("blue.500", "blue.600"),
				secondary: useColorModeValue("purple.700", "purple.600"),
				tertiary: useColorModeValue("green.600", "blue.800"),
				connectWallet: useColorModeValue(
					"linear-gradient(90deg, #665EE1 9.38%, rgba(0, 184, 255, 0.3) 128.42%)",
					"linear-gradient(90deg, #53D9D9 9.38%, rgb(0 184 255 / 35%) 128.42%)"
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
			},
		},
		border: {
			chart: useColorModeValue("#A0AEC0", "#787d85"),
			manageInput: useColorModeValue("#E2E8F0", "rgba(255, 255, 255, 0.24)"),
			farmInput: useColorModeValue("#CBD5E0", "rgba(0, 217, 239, 0.2)"),
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
			expertMode: useColorModeValue(
				"linear-gradient(90deg, #665EE1 9.38%, rgba(0, 184, 255, 0.3) 128.42%);",
				"linear-gradient(32deg, rgb(86 190 216 / 97%) 30.76%, rgb(86 190 216 / 6%) 97.76%);"
			),
			connectWallet: useColorModeValue("#04d3c0", "#153d6f70"),
			borderSettings: useColorModeValue("#A0AEC0", "rgba(255, 255, 255, 0.36)"),
			blueSys: useColorModeValue("#315df6", "#315df6"),
			wallets: useColorModeValue("#e0e0e0", "rgba(255, 255, 255, 0.36)"),
		},
	};

	return theme;
};

export { usePicasso };
