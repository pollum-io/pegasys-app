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

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const Languages: FunctionComponent<IButtonProps> = props => {
	const array = ["US", "BR", "ES", "DE", "FR", "TR", "VN", "CN"];
	const theme = usePicasso();

	return (
		<Popover>
			<PopoverTrigger {...props}>
				<IconButton
					aria-label="Popover"
					icon={
						<ReactCountryFlag
							countryCode="US"
							svg
							style={{
								width: "1.313rem",
								height: "0.938rem",
							}}
						/>
					}
					bg="transparent"
				/>
			</PopoverTrigger>
			<PopoverContent w="max-content">
				<PopoverBody
					display="flex"
					flexDirection="column"
					p="1rem"
					bgColor={theme.bg.blueNavy}
				>
					{array.map((country, index) => (
						<Flex p="0.5rem" key={country + Number(index)}>
							<ReactCountryFlag
								countryCode={country}
								svg
								style={{ fontSize: "1.5em" }}
							/>
							<Text
								paddingLeft="0.5rem"
								_hover={{ cursor: "pointer", color: theme.text.cyan }}
							>
								{country}
							</Text>
						</Flex>
					))}
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};
