import { Button, ButtonProps, useDisclosure } from "@chakra-ui/react";
import { SelectSyscoin, SelectWallets } from "components/Modals";
import { usePicasso, useWallet } from "hooks";
import { FunctionComponent } from "react";
import { AddressInfoButton } from "components/Buttons";
import { shortAddress } from "utils";
import { AddressButton } from "./AddressButton";

export const WalletButton: FunctionComponent<ButtonProps> = props => {
	const { ...rest } = props;
	const theme = usePicasso();
	const { onOpen, isOpen, onClose } = useDisclosure();
	const {
		isOpen: isOpenAddress,
		onOpen: onOpenAddress,
		onClose: onCloseAddress,
	} = useDisclosure();
	const { error } = useWallet();
	const { isConnected, walletAddress } = useWallet();

	console.log(isConnected, "asdadasdadsa");
	return (
		<>
			{!isConnected && !error && (
				<>
					<SelectWallets isOpen={isOpen} onClose={onClose} />
					<Button
						color={theme.text.connectWallet}
						bg={theme.bg.button.connectWallet}
						borderWidth="1px"
						borderStyle="solid"
						borderColor={theme.border.connectWallet}
						borderRadius={12}
						opacity="0.85"
						_hover={{
							opacity: "1",
						}}
						_active={{}}
						w="max-content"
						h="max-content"
						py="2"
						px="4"
						onClick={onOpen}
						{...rest}
					>
						Connect your wallet
					</Button>
				</>
			)}

			{error && (
				<>
					<SelectSyscoin isOpen={isOpen} onClose={onClose} />
					<AddressButton onClick={error && onOpen}>
						{walletAddress}
					</AddressButton>
				</>
			)}

			{isConnected && !error && (
				<>
					<AddressInfoButton isOpen={isOpenAddress} onClose={onCloseAddress} />
					<AddressButton onClick={error ? onOpen : onOpenAddress}>
						{shortAddress(walletAddress)}
					</AddressButton>
				</>
			)}
		</>
	);
};
