import { Flex, Text } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent } from "react";
import ReactCountryFlag from "react-country-flag";
import i18next, { availableLanguages } from "helpers/translation";

export const Languages: FunctionComponent = () => {
	const countryFlagsNames = ["US", "DE", "TR", "CN", "ES", "FR", "BR", "VN"];
	const theme = usePicasso();

	return (
		<Flex flexWrap="wrap" ml="2" mt="2">
			{availableLanguages.map((lang, index) => (
				<Flex
					p="0.5rem"
					key={lang + Number(index)}
					gap="2"
					onClick={() => {
						i18next.changeLanguage(lang);
					}}
				>
					<ReactCountryFlag
						countryCode={countryFlagsNames[index]}
						svg
						style={{ fontSize: "1.5em" }}
					/>
					<Text _hover={{ cursor: "pointer", color: theme.text.cyanPurple }}>
						{lang.toUpperCase()}
					</Text>
				</Flex>
			))}
		</Flex>
	);
};
