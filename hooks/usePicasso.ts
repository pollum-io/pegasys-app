import { useColorModeValue } from "@chakra-ui/react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";

const usePicasso = () => {
  const theme = {
    text: {
      whiteGrayHover: useColorModeValue("gray.800", "white"),
      whiteDarkPurple: useColorModeValue("#3B3693", "white"),
      lightnessGray: useColorModeValue(
        "rgba(0, 0, 0, 0.36)",
        "rgba(255, 255, 255, 0.36)",
      ),
      darkBluePurple: useColorModeValue("#3B3693", "#1A365D"),
      cyanDarkGray: useColorModeValue("#2D3748", "#00D9EF"),
      inputBluePurple: useColorModeValue("#9F7AEA", "#36B4D4"),
      whiteGray: useColorModeValue("rgba(0, 0, 0, 0.24)", "white"),
      softGray: useColorModeValue("#A0AEC0", "rgb(255, 255, 255, 0.64)"),
      cyanLightPurple: useColorModeValue("#8C15E8", "#00d9ef"),
      whitePurple: useColorModeValue("#665EE1", "white"),
      cyanPurple: useColorModeValue("#665EE1", "#00d9ef"),
      mono: useColorModeValue("#1A202C", "white"),
      gray800White: useColorModeValue("gray.800", "white"),
      lightGray: useColorModeValue("#A0AEC0", "rgba(255, 255, 255, 0.36)"),
      swapInfo: useColorModeValue("#565a69", "#c3c5cb"),
      cyan: useColorModeValue("#ffffff", "#00d9ef"),
      redError: useColorModeValue("#ff2532a3", "#ff2532a3"),
      gray: useColorModeValue("gray.400", "gray.400"),
      gray45: useColorModeValue("gray.500", "gray.400"),
      gray500: useColorModeValue("gray.500", "gray.500"),
      gray300: useColorModeValue("#718096", "#CBD5E0"),
      callGray: useColorModeValue("#718096", "#A0AEC0"),
      greenSocial: useColorModeValue("#665EE1", "#67DBD8"),
      psysBalance: useColorModeValue(
        "linear-gradient(90deg, #19EBCE 0%, #8A15E6 84.28%);",
        "linear-gradient(90deg, #19EBCE 0%, #8A15E6 84.28%);",
      ),
      red400: useColorModeValue("red.400", "red.400"),
      red500: useColorModeValue("red.500", "red.500"),
    },
    icon: {
      nightGray: useColorModeValue("#4A5568", "#EDF2F7"),
      whiteRed: useColorModeValue("#E53E3E", "#ffffff"),
      whiteDarkGray: useColorModeValue("#718096", "#ffffff"),
      helpIcon: useColorModeValue("#A0AEC0", "rgba(255, 255, 255, 0.64)"),
      pegasysLogo: useColorModeValue(
        "icons/LighttPegasysLogo.svg",
        "icons/pegasys.png",
      ),

      sysCoinLogo: useColorModeValue(
        "icons/syscoin-logo.png",
        "icons/syscoin-logo.png",
      ),

      borderExpertMode: useColorModeValue(
        "icons/Border-light-gradient-02.png",
        "icons/Border-gradient-02.png",
      ),
      inputSearchIcon: useColorModeValue("#9F7AEA", "rgba(54, 180, 212, 0.5)"),
      whiteGray: useColorModeValue("#A0AEC0", "#ffffff"),
      theme: useColorModeValue(BsFillSunFill, BsFillMoonFill),
    },
    bg: {
      poolShare: useColorModeValue("#E2E8F0", "rgba(255, 255, 255, 0.16)"),
      portfolioFooter: useColorModeValue("#F7FAFC", ""),
      hamburgerMenu: useColorModeValue("#F7FAFC", "#081120"),
      voteGray: useColorModeValue("#E2E8F0", "#081120"),
      candleGraphColor: useColorModeValue("#665EE1", "#2B6CB0"),
      bluePink: useColorModeValue("#FAF5FF", "#0B172C"),
      stakeBanner: useColorModeValue(
        "/images/backgrounds/LightBannerStake.png",
        "/images/backgrounds/BannerStake.png",
      ),
      blurPegasysLogo: useColorModeValue(
        "/icons/BlurLightPegasysLogo.png",
        "/icons/BlurPegasysLogo.png",
      ),
      psysAirdrop: useColorModeValue(
        "/images/backgrounds/LightPsysAirdrop.png",
        "/images/backgrounds/PsysAirdrop.png",
      ),
      governanceBanner: useColorModeValue(
        "/images/backgrounds/LightGovernanceBanner.png",
        "/images/backgrounds/GovernanceBanner.png",
      ),
      governanceBannerMobile: useColorModeValue(
        "/images/backgrounds/BannerGovernanceMobileLight.png",
        "/images/backgrounds/BannerGovernanceMobileDark.png",
      ),
      psysReward: useColorModeValue(
        "/images/backgrounds/LightPsysReward.png",
        "/images/backgrounds/PsysReward.png",
      ),
      subModal: useColorModeValue(
        "rgba(255, 255, 255, 0.92)",
        "rgba(11, 23, 44, 0.8)",
      ),
      subModalMobile: useColorModeValue("#F7FAFC", "rgba(255, 255, 255, 0.06)"),
      farmBanner: useColorModeValue(
        "/images/backgrounds/LightBannerFarm.png",
        "/images/backgrounds/BannerFarm.png",
      ),
      poolsBanner: useColorModeValue(
        "images/backgrounds/LightBannerPool.png",
        "images/backgrounds/BannerPools.png",
      ),
      poolsBannerMobile: useColorModeValue(
        "images/backgrounds/BannerPoolsMobileLightmode.png",
        "images/backgrounds/BannerPoolsMobile.png",
      ),
      farmBannerMobile: useColorModeValue(
        "images/backgrounds/BannerFarmMobileLightmode.png",
        "images/backgrounds/BannerFarmMobileDarkMode.png",
      ),
      stakeBannerMobile: useColorModeValue(
        "images/backgrounds/BannerStakeMobileLightmode.png",
        "images/backgrounds/BannerStakeMobileDarkmode.png",
      ),
      aidropBannerMobile: useColorModeValue(
        "images/backgrounds/BannerAidropMobileLightmode.png",
        "images/backgrounds/BannerAidropMobileDarkmode.png",
      ),
      darkBlueGray: useColorModeValue("#EDF2F7", "#081120"),
      babyBluePurple: useColorModeValue("rgba(102, 94, 225, 0.3)", "#BEE3F8"),
      neutralGray: useColorModeValue(
        "rgb(222,225,226, 0.25)",
        "rgba(255, 255, 255, 0.04)",
      ),
      whiteGray: useColorModeValue(
        "rgba(255, 255, 255, 0.8)",
        "rgba(255, 255, 255, 0.04)",
      ),
      smoothGray: useColorModeValue(
        "rgba(0, 0, 0, 0.06)",
        "rgba(255, 255, 255, 0.06)",
      ),
      menuLinksGray: useColorModeValue(
        "rgba(0, 0, 0, 0.04)",
        "rgba(255, 255, 255, 0.06)",
      ),
      softBluePink: useColorModeValue("#D6BCFA", "#153D6F"),
      alphaLightGray: useColorModeValue("rgb(0, 0, 0, 0.04)", "#081120"),
      blueLightPurple: useColorModeValue("#665EE1", "#153D6F"),
      bluePurple: useColorModeValue("#8C15E8", "#0753B2"),
      blackAlphaTransparent: useColorModeValue(
        "rgba(255, 255, 255, 0.24)",
        "rgba(0, 0, 0, 0.24)",
      ),
      primary: useColorModeValue("#EDF2F7", "#000913"),
      alphaPurple: useColorModeValue("#665EE1", "rgba(8, 17, 32, 1)"),
      blackAlpha: useColorModeValue("#ffffff", "#081120"),
      blackLightness: useColorModeValue("#F7FAFC", "#081120"),
      blueNavy: useColorModeValue("#F7FAFC", "#0B172C"),
      blueNavyLight: useColorModeValue("#ffffff", "#0B172C"),
      blueGray: useColorModeValue("#F7FAFC", "#161f29"),
      blue100: useColorModeValue("blue.100", "blue.100"),
      blue600: useColorModeValue("rgba(102, 94, 225, 0.3)", "#2B6CB0"),
      blue900: useColorModeValue("blue.900", "blue.900"),
      blueNavyLightness: useColorModeValue("#665EE1", "rgba(21, 61, 111, 1)"),
      blueNavyLightnessOp: useColorModeValue(
        "rgb(102,94,225, 0.8)",
        "rgba(21, 61, 111, 1)",
      ),
      button: {
        connectToWallet: useColorModeValue("#EEEAF4", "#153D6F"),
        connectWallet: useColorModeValue(
          "linear-gradient(90deg, #665EE1 9.38%, rgba(0, 184, 255, 0.3) 128.42%)",
          "linear-gradient(90deg, #53D9D9 9.38%, rgb(0 184 255 / 35%) 128.42%)",
        ),
        sysBalance: useColorModeValue(
          "#315df6",
          "linear-gradient(128.17deg, rgb(49, 93, 246) -14.78%, rgba(49, 93, 246, 0.2) 110.05%)",
        ),
      },
    },
    border: {
      lightGray: useColorModeValue("#A0AEC0", "#787d85"),
      lightnessGray: useColorModeValue("#E2E8F0", "rgba(255, 255, 255, 0.24)"),
      darkBlueGray: useColorModeValue("#CBD5E0", "rgba(0, 217, 239, 0.2)"),
      darkBlueGrayHover: useColorModeValue("#b6bfc9", "#00c3d7"),
      modalBorderShadow: useColorModeValue(
        "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.2);",
        "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px 15px 40px rgba(0, 0, 0, 0.4);",
      ),
      headerBorderShadow: useColorModeValue(
        "0px -5px 15px -5px rgba(102, 94, 225, 0.3)",
        "0px -10px 25px -5px rgba(86, 190, 216, 0.05);",
      ),
      headerBorder: useColorModeValue(
        "1px solid rgba(102, 94, 225, 0.25);",
        "1px solid rgba(86, 190, 216, 0.15);",
      ),
      expertMode: useColorModeValue(
        "linear-gradient(90deg, #665EE1 9.38%, rgba(0, 184, 255, 0.3) 128.42%);",
        "linear-gradient(32deg, rgb(86 190 216 / 97%) 30.76%, rgb(86 190 216 / 6%) 97.76%);",
      ),
      connectWallet: useColorModeValue("#04d3c0", "#153d6f70"),
      blueSys: useColorModeValue("#315df6", "#315df6"),
      smoothGray: useColorModeValue("#e0e0e0", "rgba(255, 255, 255, 0.36)"),
      focusBluePurple: useColorModeValue("#a39eed", "#3182CE"),
      focusGray: useColorModeValue("#ababab", "#737373"),
    },
  };

  return theme;
};

export { usePicasso };
