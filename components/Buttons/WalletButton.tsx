import {
	Button,
	ButtonProps,
	Flex,
	Text,
	useColorMode,
} from "@chakra-ui/react";
import { SelectSyscoin, SelectWallets } from "components/Modals";
import { useModal, usePicasso, useWallet } from "hooks";
import { FunctionComponent } from "react";
import { AddressInfoButton } from "components/Buttons";
import { shortAddress } from "utils";
import { ExpertMode } from "components/Header/ExpertMode";
import { ApprovalState } from "contexts";
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
	const { colorMode } = useColorMode();

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
						px={["4", "4", "4", "4"]}
						position={["absolute", "relative"]}
						bottom={["12", "8", "8", "8"]}
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
					<ExpertMode />
				</>
			)}
			{isConnected && isPending && (
				<>
					<AddressInfoButton isOpen={isOpenAddress} onClose={onCloseAddress} />

					<Flex
						ml="20px"
						zIndex="2"
						py={["2", "2", "2", "2"]}
						position={["absolute", "relative"]}
						left={["6", "32"]}
						bottom={["12", "2.2rem"]}
						w="2.313rem"
						h="1.25rem"
						borderRadius="xl"
						gap="1"
						bgColor={theme.bg.blueLightPurple}
						border="1px solid"
						borderColor={colorMode === "dark" ? "#1A4A87" : "transparent"}
						alignItems="center"
						justifyContent="center"
					>
						<Text fontSize="14px" color="white">
							{pendingTxLength}
						</Text>
						<Flex
							className="circleLoading"
							id={
								colorMode === "dark" ? "smallPendingDark" : "smallPendingLight"
							}
						/>
					</Flex>
					<AddressButton
						onClick={walletError ? onOpenSelectWalletModal : onOpenAddress}
						pending={approvalState?.status === ApprovalState.PENDING}
					>
						{shortAddress(walletAddress)}
					</AddressButton>
				</>
			)}
		</>
	);
};
