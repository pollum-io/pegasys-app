import {
	Button,
	ButtonProps,
	Flex,
	Text,
	useColorMode,
	Collapse,
} from "@chakra-ui/react";
import { SelectSyscoin, SelectWallets } from "components/Modals";
import { useModal, usePicasso } from "hooks";
import { FunctionComponent } from "react";
import { AddressInfoButton } from "components/Buttons";
import { shortAddress } from "utils";
import { ExpertMode } from "components/Header/ExpertMode";
import {
	useWallet,
	usePegasys,
	ApprovalState,
	useTransaction,
} from "pegasys-services";
import { useTranslation } from "react-i18next";
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

	const { approvalState, pendingTxLength } = useTransaction();
	const { address, isConnected, walletError } = useWallet();
	const { expert } = usePegasys();

	const isPending = approvalState.status === ApprovalState.PENDING;
	const { colorMode } = useColorMode();
	const { t: translation } = useTranslation();

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
						onClick={onOpenSelectWalletModal}
						{...rest}
					>
						{translation("addLiquidity.connectWallet")}
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
						{address}
					</AddressButton>
				</>
			)}

			{isConnected && !walletError && !isPending && (
				<>
					<AddressInfoButton isOpen={isOpenAddress} onClose={onCloseAddress} />
					<AddressButton
						onClick={walletError ? onOpenSelectWalletModal : onOpenAddress}
					>
						{shortAddress(address)}
					</AddressButton>
					<Collapse in={expert}>
						<ExpertMode />
					</Collapse>
				</>
			)}
			{isConnected && isPending && (
				<>
					<AddressInfoButton isOpen={isOpenAddress} onClose={onCloseAddress} />

					<Flex
						zIndex="2"
						py={["2", "2", "2", "2"]}
						position="absolute"
						right={["10rem", "10.5rem", "12rem", "12rem"]}
						bottom="4.5rem"
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
						{shortAddress(address)}
					</AddressButton>
				</>
			)}
		</>
	);
};
