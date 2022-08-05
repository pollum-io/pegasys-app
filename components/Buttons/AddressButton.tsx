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
			ml="4"
			fontSize="md"
			borderRadius={84}
			fontWeight={500}
			py={["2", "2", "2", "2"]}
			px={["3", "3", "3", "3"]}
			position={["absolute", "relative"]}
			bottom={["12", "10"]}
			left={["20%", "0", "0", "0"]}
			textTransform="uppercase"
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
					{" "}
					<Flex pr="2" textTransform="uppercase">
						<Jazzicon
							diameter={18}
							seed={Math.round(Math.random() * 10000000)}
						/>
					</Flex>
					{children}
				</>
			)}
		</Button>
	);
};
