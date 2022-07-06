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
	const { walletError } = useWallet();

	return (
		<Button
			bg={walletError ? theme.text.redError : theme.bg.button.userAddress}
			justifyContent="space-arround"
			w="max-content"
			h="max-content"
			py="2"
			px="8"
			ml="5"
			fontSize="md"
			borderRadius={84}
			fontWeight={500}
			bottom="8"
			overflow="hidden"
			_hover={{
				borderColor: walletError ? theme.text.redError : theme.text.cyan,
			}}
			_active={{}}
			{...rest}
		>
			{walletError ? (
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
