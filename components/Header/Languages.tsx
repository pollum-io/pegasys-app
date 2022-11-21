import { Flex, Text } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent } from "react";
import ReactCountryFlag from "react-country-flag";
import i18next, { availableLanguages } from "helpers/translation";

export const Languages: FunctionComponent = () => {
	const countryFlagsNames = ["US", "DE", "TR", "CN", "ES", "FR", "VN", "BR"];
	const theme = usePicasso();

	return (
		<Flex flexWrap="wrap" ml="0" mt="2" gap="1" pl="1.5rem">
			{availableLanguages.map((lang, index) => (
				<Flex
					py="0.5rem"
					pr="1rem"
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
					<Text>{lang.toUpperCase()}</Text>
				</Flex>
			))}
		</Flex>
	);
};
