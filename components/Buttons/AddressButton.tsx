import { Button, ButtonProps, Flex } from "@chakra-ui/react";
import { usePicasso, useWallet } from "hooks";
import { FunctionComponent, ReactNode } from "react";
import Jazzicon from "react-jazzicon";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
	onClick?: () => void;
	pending?: boolean;
}

export const AddressButton: FunctionComponent<IButtonProps> = props => {
	const theme = usePicasso();
	const { children, pending, ...rest } = props;
	const { walletError, expert } = useWallet();

	return (
		<Button
			zIndex="1"
			color="white"
			bg={walletError ? theme.text.redError : theme.bg.button.connectWallet}
			borderColor={theme.border.connectWallet}
			justifyContent="space-arround"
			w="max-content"
			h="max-content"
			ml="4"
			fontSize="md"
			borderRadius={84}
			fontWeight={500}
			py={["2", "2", "2", "2"]}
			px={["3", "4", "4", "4"]}
			position={["absolute", "relative"]}
			bottom={["12", "8", "8", "8"]}
			right={expert ? ["40%", "0", "0", "0"] : ["27%", "0", "0", "0"]}
			textTransform="uppercase"
			overflow="hidden"
			opacity="0.85"
			_hover={{
				opacity: "1",
			}}
			_active={{}}
			{...rest}
		>
			{walletError ? (
				"Wrong Network"
			) : (
				<>
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
