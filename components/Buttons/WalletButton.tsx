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
	const {
		onOpen: onOpenSelectWalletModal,
		isOpen: isOpenSelectWalletModal,
		onClose: onCloseSelectWalletModal,
	} = useDisclosure();
	const {
		isOpen: isOpenSelectSyscoin,
		onOpen: onOpenSelectSyscoin,
		onClose: onCloseSelectSyscoin,
	} = useDisclosure();
	const {
		isOpen: isOpenAddress,
		onOpen: onOpenAddress,
		onClose: onCloseAddress,
	} = useDisclosure();
	const { isConnected, walletAddress, walletError } = useWallet();

	return (
		<>
			{!isConnected && !walletError && (
				<>
					<SelectWallets
						isOpen={isOpenSelectWalletModal}
						onClose={onCloseSelectWalletModal}
					/>
					<Button
						color="white"
						bg={theme.bg.button.connectWallet}
						borderColor={theme.border.connectWallet}
						borderRadius={84}
						opacity="0.85"
						_hover={{
							opacity: "1",
						}}
						_active={{}}
						w="max-content"
						h="max-content"
						py="2"
						px="8"
						ml="5"
						position="fixed"
						bottom="10"
						onClick={onOpenSelectWalletModal}
						{...rest}
					>
						Connect wallet
					</Button>
				</>
			)}

			{walletError && (
				<>
					<SelectSyscoin
						isOpen={isOpenSelectSyscoin}
						onClose={onCloseSelectSyscoin}
					/>
					<AddressButton onClick={walletError && onOpenSelectSyscoin}>
						{walletAddress}
					</AddressButton>
				</>
			)}

			{isConnected && !walletError && (
				<>
					<AddressInfoButton isOpen={isOpenAddress} onClose={onCloseAddress} />
					<AddressButton
						onClick={walletError ? onOpenSelectWalletModal : onOpenAddress}
					>
						{shortAddress(walletAddress)}
					</AddressButton>
				</>
			)}
		</>
	);
};
