import { Button, ButtonProps, useDisclosure } from "@chakra-ui/react";
import { SelectSyscoin, SelectWallets } from "components/Modals";
import { usePicasso, useWallet } from "hooks";
import { FunctionComponent } from "react";
import { AddressInfoButton } from "components/Buttons";
import { shortAddress } from "utils";
import { ExpertMode } from "components/Header/ExpertMode";
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
						py={["2", "2", "2", "2"]}
						px={["6", "6", "8", "8"]}
						position={["absolute", "relative"]}
						bottom={["12", "10"]}
						left={["25%", "0", "0", "0"]}
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
					<ExpertMode />
				</>
			)}
		</>
	);
};
