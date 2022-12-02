import { Button, ButtonProps, Flex } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, ReactNode } from "react";
import Jazzicon from "react-jazzicon";
import { useTranslation } from "react-i18next";

import { usePegasys, useWallet } from "pegasys-services";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
	onClick?: () => void;
	pending?: boolean;
}

export const AddressButton: FunctionComponent<IButtonProps> = props => {
	const theme = usePicasso();
	const { children, ...rest } = props;
	const { expert } = usePegasys();
	const { walletError, address } = useWallet();
	const { t: translation } = useTranslation();

	return (
		<Button
			zIndex="1"
			color="white"
			bg={walletError ? theme.text.redError : theme.bg.button.connectWallet}
			borderColor={theme.border.connectWallet}
			justifyContent="space-arround"
			w="max-content"
			h="max-content"
			ml={expert ? ["6", "4", "4", "4"] : ["0", "4", "4", "4"]}
			fontSize="md"
			borderRadius={84}
			fontWeight={500}
			py={["2", "2", "2", "2"]}
			px={["4", "4", "4", "4"]}
			position={["unset", "relative"]}
			bottom={["12", "8", "8", "8"]}
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
				translation("walletModal.wrongNetwork")
			) : (
				<>
					<Flex pr="2" textTransform="uppercase">
						<Jazzicon diameter={18} seed={Number(address)} />
					</Flex>
					{children}
				</>
			)}
		</Button>
	);
};
