import { Flex, Input, InputGroup } from "@chakra-ui/react";
import React, { useState } from "react";
import { setType } from "pegasys-services";
import { MdSearch } from "react-icons/md";
import { usePicasso } from "hooks";

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
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		setTimeout(() => {}, 0)
	);

	const onInputChange = (newValue: string) => {
		clearTimeout(timeoutid);

		const id = setTimeout(() => {
			setSearch(newValue);
		}, 700);

		setTimeoutid(id);
	};

	const theme = usePicasso();

	return (
		<InputGroup right="0rem">
			<Input
				placeholder={placeholder.value}
				_placeholder={{ opacity: 1, color: placeholder.color }}
				borderColor={borderColor}
				borderRadius="full"
				w={["20rem", "28rem", "16rem", "16rem"]}
				h="2.2rem"
				py={["0.2rem", "0.2rem", "1", "1"]}
				pl="10"
				_focus={{ outline: "none", borderColor: theme.border.focusBluePurple }}
				_hover={{}}
				onChange={e => onInputChange(e.target.value)}
			/>
			<Flex position="absolute" pl="0.9rem" bottom="0.43rem">
				<MdSearch color={iconColor} size={20} />
			</Flex>
		</InputGroup>
	);
};

export default SearchInput;
