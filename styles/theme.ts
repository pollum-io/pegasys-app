import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
	useSystemColorMode: false,
};

export const theme = extendTheme({
	config,
	overrides: {
		styles: {
			"*": {
				boxShadow: "none",
			},
		},
	},
	components: {
		Switch: {
			baseStyle: {
				track: {
					_focus: {
						boxShadow: "none",
					},
				},
			},
		},
		ModalCloseButton: {
			baseStyle: {
				_focus: {
					boxShadow: "none",
				},
			},
		},
		Button: {
			baseStyle: {
				_focus: {
					boxShadow: "none",
				},
			},
		},
	},
	zIndices: {
		default: 1,
		behind: "-1000",
	},
	colors: {
		gray: {
			700: "#2c2f36",
		},
		cyanDark: {
			100: "#00d9ef",
		},
		purpleLight: {
			200: "#665EE1",
		},
	},
	fonts: {
		heading: "Inter",
		body: "Inter",
		mono: "Roboto Mono",
	},
});
