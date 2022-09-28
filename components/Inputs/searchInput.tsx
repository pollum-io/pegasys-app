import { Flex, Input, InputGroup } from "@chakra-ui/react";
import React, { useState } from "react";
import { setType } from "pegasys-services";
import { MdSearch } from "react-icons/md";

interface ISearchInputProps {
	setSearch: setType<string>;
	placeholder: {
		value: string;
		color: string;
	};
	borderColor: string;
	iconColor: string;
}

const SearchInput: React.FC<ISearchInputProps> = ({
	setSearch,
	placeholder,
	borderColor,
	iconColor,
}) => {
	const [timeoutid, setTimeoutid] = useState<NodeJS.Timeout>(
		setTimeout(() => {}, 0)
	);

	const onInputChange = (newValue: string) => {
		clearTimeout(timeoutid);

		const id = setTimeout(() => {
			setSearch(newValue);
		}, 700);

		setTimeoutid(id);
	};

	return (
		<InputGroup right="0rem">
			<Input
				placeholder={placeholder.value}
				_placeholder={{ opacity: 1, color: placeholder.color }}
				borderColor={borderColor}
				borderRadius="full"
				w={["20rem", "28rem", "20rem", "20rem"]}
				h="2.2rem"
				py={["0.2rem", "0.2rem", "1", "1"]}
				pl="10"
				_focus={{ outline: "none" }}
				_hover={{}}
				onChange={e => onInputChange(e.target.value)}
			/>
			<Flex
				pt="1rem"
				position="absolute"
				pl="0.9rem"
				bottom={["0.3rem", "0.3rem", "0.5rem", "0.5rem"]}
			>
				<MdSearch color={iconColor} size={20} />
			</Flex>
		</InputGroup>
	);
};

export default SearchInput;
