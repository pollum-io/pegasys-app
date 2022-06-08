import { Button, ButtonProps, Flex } from "@chakra-ui/react";
import { usePicasso, useWallet } from "hooks";
import { FunctionComponent, ReactNode } from "react";
import Jazzicon from "react-jazzicon";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
	onClick?: () => void;
}

export const AddressButton: FunctionComponent<IButtonProps> = props => {
	const theme = usePicasso();
	const { children, ...rest } = props;
	const { error } = useWallet();

	return (
		<Button
			bg={error ? theme.text.redError : theme.bg.button.userAddress}
			justifyContent="space-arround"
			w="max-content"
			h="max-content"
			py="2"
			px="4"
			fontSize="md"
			borderWidth="1px"
			borderStyle="solid"
			borderRadius={12}
			fontWeight={500}
			overflow="hidden"
			_hover={{
				borderColor: error ? theme.text.redError : theme.text.cyan,
			}}
			_active={{}}
			{...rest}
		>
			{error ? (
				"Wrong Network"
			) : (
				<>
					{children}
					<Flex pl="2">
						<Jazzicon
							diameter={15}
							seed={Math.round(Math.random() * 10000000)}
						/>
					</Flex>
				</>
			)}
		</Button>
	);
};
