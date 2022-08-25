import { Button, ButtonProps, Flex, Text } from "@chakra-ui/react";
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

	const {
		isConnected,
		walletAddress,
		walletError,
		approvalState,
		pendingTxLength,
	} = useWallet();

	const isPending = approvalState.status === ApprovalState.PENDING;

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

			{isConnected && !walletError && !isPending && (
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
			{isConnected && isPending && (
				<>
					<AddressInfoButton isOpen={isOpenAddress} onClose={onCloseAddress} />
					<Flex
						ml="20px"
						zIndex="1"
						mb="10px"
						w="2.313rem"
						h="1.25rem"
						borderRadius="xl"
						gap="1"
						bgColor={theme.bg.blueLightPurple}
						border="1px solid"
						borderColor="#1A4A87"
						alignItems="center"
						justifyContent="center"
					>
						<Text fontSize="14px" mb="1px">
							{pendingTxLength}
						</Text>
						<Flex className="circleLoadingPending" />
					</Flex>
					<AddressButton
						onClick={walletError ? onOpenSelectWalletModal : onOpenAddress}
						pending={approvalState?.status === ApprovalState.PENDING}
					/>
				</>
			)}
		</>
	);
};
