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
import { FunctionComponent, useEffect, useMemo } from "react";
import { AddressInfoButton } from "components/Buttons";
import { shortAddress } from "utils";
import { ExpertMode } from "components/Header/ExpertMode";
import { useWallet, usePegasys, useTransaction } from "pegasys-services";
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

	const { pendingTxs } = useTransaction();
	const { address, isConnected, walletError, chainId } = useWallet();
	const { expert } = usePegasys();
	const { colorMode } = useColorMode();
	const { t: translation } = useTranslation();

	useEffect(() => {
		if (walletError) onOpenSelectSyscoin();
	}, [walletError]);

	const isPending = useMemo(() => {
		if (pendingTxs.length) {
			return true;
		}

		return false;
	}, [chainId, pendingTxs]);

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
						position={["unset", "relative"]}
						bottom={["0", "8", "8", "8"]}
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
						right={["-2", "8.8rem", "12.5rem", "12.5rem"]}
						bottom={["1.9rem", "4.5rem", "4.5rem", "4.5rem"]}
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
						<Text fontSize="0.875rem" color="white">
							{pendingTxs.length ?? 0}
						</Text>
						<Flex
							mb="0.04rem"
							className="circleLoading"
							id={
								colorMode === "dark" ? "smallPendingDark" : "smallPendingLight"
							}
						/>
					</Flex>
					<AddressButton
						onClick={walletError ? onOpenSelectWalletModal : onOpenAddress}
						pending={isPending}
					>
						{shortAddress(address)}
					</AddressButton>
					<Collapse in={expert}>
						<ExpertMode />
					</Collapse>
				</>
			)}
		</>
	);
};
