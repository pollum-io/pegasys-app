import {
	ButtonProps,
	Flex,
	IconButton,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Text
} from '@chakra-ui/react';
import { FunctionComponent, ReactNode } from 'react';
import ReactCountryFlag from 'react-country-flag';

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const Languages: FunctionComponent<IButtonProps> = props => {
	const array = ['US', 'BR', 'ES', 'DE', 'FR', 'TR', 'VN', 'CN'];

	return (
		<Popover>
			<PopoverTrigger {...props}>
				<IconButton
					aria-label="Popover"
					icon={<ReactCountryFlag countryCode="US" svg />}
				/>
			</PopoverTrigger>
			<PopoverContent w="max-content">
				<PopoverBody display="flex" flexDirection="column" p="0rem">
					{array.map((country, index) => (
						<Flex p="0.5rem" key={country + Number(index)}>
							<ReactCountryFlag
								countryCode={country}
								svg
								style={{ fontSize: '1.5em' }}
							/>
							<Text paddingLeft="0.5rem">{country}</Text>
						</Flex>
					))}
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};
