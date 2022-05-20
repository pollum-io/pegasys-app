import { useColorModeValue } from '@chakra-ui/react';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';

const usePicasso = () => {
	const theme = {
		text: {
			mono: useColorModeValue('gray.700', 'white'),
			blue: useColorModeValue('white', 'cyan.300'),
			infoLink: useColorModeValue('#565a69', '#c3c5cb'),
			connectWallet: useColorModeValue('#ffffff', '#00d9ef'),
			swapInfo: useColorModeValue('#565a69', '#c3c5cb'),
			whiteCyan: useColorModeValue('#ffffff', '#00d9ef'),
			cyan: useColorModeValue('#00d9ef', '#00d9ef')
		},
		icon: {
			theme: useColorModeValue(BsFillMoonFill, BsFillSunFill),
		},
		bg: {
			primary: useColorModeValue('blackAlpha.50', 'gray.700'),
			secondary: useColorModeValue('gray.300', 'gray.800'),
			bgPrimary: useColorModeValue('#f7f8fa', '#2c2f36'),
			whiteGray: useColorModeValue('#ffffff', '#212429'),
			iceGray: useColorModeValue('#f7f8fa', '#2c2f36'),
			button: {
				primary: useColorModeValue('blue.500', 'blue.600'),
				secondary: useColorModeValue('purple.700', 'purple.600'),
				tertiary: useColorModeValue('green.600', 'blue.800'),
				connectWallet: useColorModeValue('#04d3c0', '#153d6f70'),
				slippageSetting: useColorModeValue('#ffffff', '#212429'),
				sysBalance: useColorModeValue(
					'#315df6',
					'linear-gradient(128.17deg, rgb(49, 93, 246) -14.78%, rgba(49, 93, 246, 0.2) 110.05%)'
				),
				psysBalance: useColorModeValue(
					'linear-gradient(128.17deg, rgb(104, 83, 217) -14.78%, rgb(189, 0, 255) 110.05%)',
					'linear-gradient(321deg, rgba(104, 83, 217, 0.48) -14.78%, rgb(189, 0, 255) 110.05%)'
				),
				network: useColorModeValue(
					'#315df6',
					'linear-gradient(128.17deg, rgb(49, 93, 246) -14.78%, rgba(49, 93, 246, 0.2) 110.05%)'
				),
				swapBlue: useColorModeValue('#00d9ef', '#153d6f70'),
				swapTokenCurrency: useColorModeValue('#F7F8FA', '#2C2F36'),
			},
		},
		border: {
			connectWallet: useColorModeValue('#04d3c0', '#153d6f70'),
			borderSettings: useColorModeValue('#edeef2', '#40444f'),
			blueSys: useColorModeValue('#315df6', '#315df6'),
			swapInput: useColorModeValue('#f7f8fa', '#2c2f36'),
			walltes: useColorModeValue('#edeef2', '#40444f'),
		},
	};

	return theme;
};

export { usePicasso };
