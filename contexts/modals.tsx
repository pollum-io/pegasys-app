import { useDisclosure } from "@chakra-ui/react";
import { createContext, useMemo } from "react";

export const ModalContext = createContext({} as any);

export const ModalsProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const {
		onOpen: onOpenAddLiquidity,
		isOpen: isOpenAddLiquidity,
		onClose: onCloseAddLiquidity,
	} = useDisclosure();

	const {
		onOpen: onOpenImportPool,
		isOpen: isOpenImportPool,
		onClose: onCloseImportPool,
	} = useDisclosure();

	const {
		onOpen: onOpenRemoveLiquidity,
		isOpen: isOpenRemoveLiquidity,
		onClose: onCloseRemoveLiquidity,
	} = useDisclosure();

	const {
		onOpen: onOpenTokenImported,
		isOpen: isOpenTokenImported,
		onClose: onCloseTokenImported,
	} = useDisclosure();

	const {
		onOpen: onOpenWallet,
		isOpen: isOpenWallet,
		onClose: onCloseWallet,
	} = useDisclosure();

	const {
		onOpen: onOpenCoin,
		isOpen: isOpenCoin,
		onClose: onCloseCoin,
	} = useDisclosure();

	const {
		onOpen: onOpenConfirmSwap,
		isOpen: isOpenConfirmSwap,
		onClose: onCloseConfirmSwap,
	} = useDisclosure();

	const {
		onOpen: onOpenConfirmList,
		isOpen: isOpenConfirmList,
		onClose: onCloseConfirmList,
	} = useDisclosure();

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

	const {
		isOpen: isOpenFarmActions,
		onOpen: onOpenFarmActions,
		onClose: onCloseFarmActions,
	} = useDisclosure();

	const {
		isOpen: isOpenStakeActions,
		onOpen: onOpenStakeActions,
		onClose: onCloseStakeActions,
	} = useDisclosure();

	const {
		isOpen: isOpenPsysBreakdown,
		onOpen: onOpenPsysBreakdown,
		onClose: onClosePsysBreakdown,
	} = useDisclosure();

	const {
		onOpen: onOpenManageToken,
		isOpen: isOpenManageToken,
		onClose: onCloseManageToken,
	} = useDisclosure();

	const modalProviderValue = useMemo(
		() => ({
			onOpenImportPool,
			isOpenImportPool,
			onCloseImportPool,
			onOpenRemoveLiquidity,
			isOpenRemoveLiquidity,
			onCloseRemoveLiquidity,
			onOpenTokenImported,
			isOpenTokenImported,
			onCloseTokenImported,
			onOpenAddLiquidity,
			isOpenAddLiquidity,
			onCloseAddLiquidity,
			onOpenWallet,
			isOpenWallet,
			onCloseWallet,
			onOpenCoin,
			isOpenCoin,
			onCloseCoin,
			onOpenConfirmSwap,
			isOpenConfirmSwap,
			onCloseConfirmSwap,
			onOpenSelectWalletModal,
			isOpenSelectWalletModal,
			onCloseSelectWalletModal,
			isOpenSelectSyscoin,
			onOpenSelectSyscoin,
			onCloseSelectSyscoin,
			isOpenAddress,
			onOpenAddress,
			onCloseAddress,
			isOpenFarmActions,
			onOpenFarmActions,
			onCloseFarmActions,
			isOpenPsysBreakdown,
			onOpenPsysBreakdown,
			onClosePsysBreakdown,
			onOpenConfirmList,
			isOpenConfirmList,
			onCloseConfirmList,
			onOpenManageToken,
			isOpenManageToken,
			onCloseManageToken,
			isOpenStakeActions,
			onOpenStakeActions,
			onCloseStakeActions,
		}),
		[
			onOpenImportPool,
			isOpenImportPool,
			onCloseImportPool,
			onOpenRemoveLiquidity,
			isOpenRemoveLiquidity,
			onCloseRemoveLiquidity,
			onOpenTokenImported,
			isOpenTokenImported,
			onCloseTokenImported,
			onOpenAddLiquidity,
			isOpenAddLiquidity,
			onCloseAddLiquidity,
			onOpenWallet,
			isOpenWallet,
			onCloseWallet,
			onOpenCoin,
			isOpenCoin,
			onCloseCoin,
			onOpenConfirmSwap,
			isOpenConfirmSwap,
			onCloseConfirmSwap,
			onOpenSelectWalletModal,
			isOpenSelectWalletModal,
			onCloseSelectWalletModal,
			isOpenSelectSyscoin,
			onOpenSelectSyscoin,
			onCloseSelectSyscoin,
			isOpenAddress,
			onOpenAddress,
			onCloseAddress,
			isOpenFarmActions,
			onOpenFarmActions,
			onCloseFarmActions,
			isOpenPsysBreakdown,
			onOpenPsysBreakdown,
			onClosePsysBreakdown,
			onOpenConfirmList,
			isOpenConfirmList,
			onCloseConfirmList,
			onOpenManageToken,
			isOpenManageToken,
			onCloseManageToken,
			isOpenStakeActions,
			onOpenStakeActions,
			onCloseStakeActions,
		]
	);

	return (
		<ModalContext.Provider value={modalProviderValue}>
			{children}
		</ModalContext.Provider>
	);
};
