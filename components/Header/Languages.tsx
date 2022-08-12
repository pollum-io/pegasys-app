import {
	ButtonProps,
	Flex,
	IconButton,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Text,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, ReactNode } from "react";
import ReactCountryFlag from "react-country-flag";

export const Languages: FunctionComponent = () => {
	const array = ["US", "BR", "ES", "DE", "FR", "TR", "VN", "CN"];
	const theme = usePicasso();

	return (
		<Flex flexWrap="wrap" ml="2" mt="2">
			{array.map((country, index) => (
				<Flex p="0.5rem" key={country + Number(index)} gap="2">
					<ReactCountryFlag
						countryCode={country}
						svg
						style={{ fontSize: "1.5em" }}
					/>
					<Text _hover={{ cursor: "pointer", color: theme.text.cyanPurple }}>
						{country}
					</Text>
				</Flex>
			))}
		</Flex>
	);
};
