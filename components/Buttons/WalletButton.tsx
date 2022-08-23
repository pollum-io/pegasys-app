import { Button, ButtonProps, Flex } from "@chakra-ui/react";
import { SelectSyscoin, SelectWallets } from "components/Modals";
import { useModal, usePicasso, useWallet } from "hooks";
import { FunctionComponent } from "react";
import { AddressInfoButton } from "components/Buttons";
import { shortAddress } from "utils";
import { ExpertMode } from "components/Header/ExpertMode";
import { ApprovalState } from "contexts";
import { Circles } from "react-loading-icons";
import { AddressButton } from "./AddressButton";

export const WalletButton: FunctionComponent<ButtonProps> = props => {
	const { ...rest } = props;
	const theme = usePicasso();
	const {
		onOpenSelectWalletModal,
		isOpenSelectWalletModal,
		onCloseSelectWalletModal,
		isOpenSelectSyscoin,
		onOpenSelectSyscoin,
		onCloseSelectSyscoin,
		isOpenAddress,
		onOpenAddress,
		onCloseAddress,
	} = useModal();

	const { isConnected, walletAddress, walletError, approvalState } =
		useWallet();

	const isPending = approvalState.status === ApprovalState.PENDING;

	return (
		<>
			{!isConnected && !walletError && (
				<Flex>
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
						left={["28%", "0", "0", "0"]}
						onClick={onOpenSelectWalletModal}
						{...rest}
					>
						Connect wallet
					</Button>
				</Flex>
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

			{isConnected && !walletError && !isPending && (
				<>
					<AddressInfoButton isOpen={isOpenAddress} onClose={onCloseAddress} />
					<AddressButton
						onClick={walletError ? onOpenSelectWalletModal : onOpenAddress}
					>
						{shortAddress(walletAddress)}
					</AddressButton>
					<Flex display={["none", "flex", "flex", "flex"]} zIndex="-99">
						<ExpertMode />
					</Flex>
				</>
			)}
			{isConnected && isPending && (
				<>
					<AddressInfoButton isOpen={isOpenAddress} onClose={onCloseAddress} />
					<AddressButton
						onClick={walletError ? onOpenSelectWalletModal : onOpenAddress}
						pending={approvalState?.status === ApprovalState.PENDING}
					>
						<Circles width={25} height={25} style={{ paddingRight: "6px" }} />
						Pending
					</AddressButton>
				</>
			)}
		</>
	);
};
