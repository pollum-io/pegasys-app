import { Flex, Text } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent } from "react";
import ReactCountryFlag from "react-country-flag";
import i18next, { availableLanguages } from "helpers/translation";
import { useTranslation } from "react-i18next";

export const Languages: FunctionComponent = () => {
	const countryFlagsNames = ["US", "DE", "TR", "CN", "ES", "FR", "VN", "BR"];
	const theme = usePicasso();
	const { i18n } = useTranslation();
	const { language } = i18n;

	return (
		<Flex
			flexWrap="wrap"
			ml="0"
			mt="2"
			gap="1"
			pl={["0", "1.5rem", "1.5rem", "1.5rem"]}
			mb={["1rem", "unset", "unset", "unset"]}
		>
			{availableLanguages.map((lang, index) => (
				<Flex
					py="0.5rem"
					pr={lang === "pt-br" ? "0" : "1rem"}
					key={lang + Number(index)}
					gap="2"
					onClick={() => {
						i18next.changeLanguage(lang);
					}}
					_hover={{ cursor: "pointer", color: theme.text.cyanPurple }}
				>
					<ReactCountryFlag
						countryCode={countryFlagsNames[index]}
						svg
						style={{ fontSize: "1.5em" }}
					/>
					<Text
						color={lang === language ? theme.text.cyanPurple : theme.text.mono}
					>
						{lang.toUpperCase()}
					</Text>
				</Flex>
			))}
		</Flex>
	);
};
