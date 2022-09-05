import { Text } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";

interface IButtonProps {
	children?: ReactNode;
	onClick?: () => void;
}

export const TokenButton: FunctionComponent<IButtonProps> = props => {
	const { children, ...rest } = props;
	const token = "PSYS";

	return (
		<Text
			h="max-content"
			bgClip="text"
			fontWeight="normal"
			fontSize="md"
			transition="0.1s"
			_hover={{ cursor: "pointer", fontWeight: "700" }}
			_active={{}}
			className="textAnimation"
			{...rest}
		>
			{children}
			{token}
		</Text>
	);
};
