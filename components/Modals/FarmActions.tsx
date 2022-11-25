import {
	Flex,
	Icon,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { useTranslation } from "react-i18next";

import { useFarm, useEarn } from "pegasys-services";
import React from "react";
import { MdArrowBack, MdOutlineInfo } from "react-icons/md";
import {
	EarnActionsHeader,
	EarnDepositAction,
	EarnClaimAction,
	EarnWithdrawAction,
} from "../Earn";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const FarmActions: React.FC<IModal> = props => {
	const { isOpen, onClose: close } = props;
	const theme = usePicasso();
	const { claim, withdraw, deposit, sign } = useFarm();
	const { buttonId, selectedOpportunity, withdrawPercentage, reset } =
		useEarn();
	const { t } = useTranslation();

	if (!selectedOpportunity) {
		return null;
	}

	const onClose = () => {
		reset();
		close();
	};

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				mt={
					buttonId === "withdraw"
						? withdrawPercentage === 100
							? ["8rem", "10.5rem", "10rem", "10rem"]
							: ["8rem", "14.4rem", "10rem", "10rem"]
						: buttonId === "deposit"
						? ["8rem", "23.5rem", "10rem", "10rem"]
						: ["8rem", "19.4rem", "10rem", "10rem"]
				}
				mb={["0", "0", "10rem", "10rem"]}
				position={["fixed", "relative", "relative", "relative"]}
				bottom="0"
				maxWidth="max-content"
				w={["100vw", "30.625rem", "max-content", "max-content"]}
				h={["max-content", "max-content", "max-content", "max-content"]}
				borderTopRadius={["3xl", "3xl", "3xl", "3xl"]}
				borderBottomRadius={["0px", "0", "3xl", "3xl"]}
				bgColor={theme.bg.blueNavyLight}
				border={["none", "1px solid transparent"]}
				borderBottom={["none", "none", "", ""]}
				boxShadow="0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)"
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					backgroundColor={theme.bg.blueNavyLight}
					borderTopRadius="3xl"
					alignItems="baseline"
					justifyContent="space-between"
					pl={["4", "5", "20", "20"]}
				>
					<Flex
						flex="1"
						display={{
							base: "flex",
							sm: "flex",
							md: "none",
							lg: "none",
						}}
						justifyContent="left"
						gap="2"
						onClick={onClose}
						color={theme.text.callGray}
						alignItems="center"
					>
						<MdArrowBack size={25} />
						<Text>Farms</Text>
					</Flex>
					<EarnActionsHeader
						onClose={onClose}
						depositTitle={t("earnPages.deposit")}
						withdrawTitle={t("earnPages.withdraw")}
						claimTitle={t("earnPages.claim")}
					/>
				</ModalHeader>
				<ModalBody
					mb="2"
					borderBottomRadius={["0", "0", "3xl", "3xl"]}
					background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
				>
					<EarnDepositAction
						sign={sign}
						buttonTitle={t("earnPages.deposit")}
						deposit={deposit}
					/>
					<EarnWithdrawAction
						onClose={onClose}
						buttonTitle={t("earnPages.withdraw")}
						withdraw={withdraw}
					/>
					<EarnClaimAction claim={claim} />
				</ModalBody>
				<Flex>
					{buttonId === "withdraw" && (
						<Flex
							flexDirection="row"
							p="1.5rem"
							background={[
								theme.bg.smoothGray,
								theme.bg.smoothGray,
								theme.bg.subModal,
								theme.bg.subModal,
							]}
							position={["relative", "relative", "absolute", "absolute"]}
							w="100%"
							bottom={
								withdrawPercentage === 100
									? ["unset", "unset", "-12rem", "-12rem"]
									: ["unset", "unset", "-9rem", "-9rem"]
							}
							borderTopRadius={["0", "0", "3xl", "3xl"]}
							borderBottomRadius={["0", "0", "3xl", "3xl"]}
							alignItems="flex-start"
							gap="2"
							transition="500ms"
						>
							<Flex>
								<Icon
									as={MdOutlineInfo}
									w="6"
									h="6"
									color={theme.text.cyanPurple}
								/>
							</Flex>
							<Flex
								flexDirection="column"
								gap="6"
								color={theme.text.mono}
								textAlign="justify"
							>
								{withdrawPercentage === 100 ? (
									<Text>{t("earnPages.farmingWithdrawAndClaimTooltip")}</Text>
								) : (
									<Text>{t("earnPages.farmingWithdrawTooltip")}</Text>
								)}
							</Flex>
						</Flex>
					)}
					{buttonId === "claim" && (
						<Flex
							flexDirection="row"
							p="1.5rem"
							background={[
								theme.bg.smoothGray,
								theme.bg.smoothGray,
								theme.bg.subModal,
								theme.bg.subModal,
							]}
							position={["relative", "relative", "absolute", "absolute"]}
							w="100%"
							bottom={["unset", "unset", "-9.5rem", "-9.5rem"]}
							borderTopRadius={["0", "0", "3xl", "3xl"]}
							borderBottomRadius={["0", "0", "3xl", "3xl"]}
							alignItems="flex-start"
							gap="2"
						>
							<Flex>
								<Icon
									as={MdOutlineInfo}
									w="6"
									h="6"
									color={theme.text.cyanPurple}
								/>
							</Flex>
							<Flex
								flexDirection="column"
								gap="6"
								color={theme.text.mono}
								textAlign="justify"
							>
								<Text>{t("earnPages.farmingClaimTooltip")}</Text>
							</Flex>
						</Flex>
					)}
				</Flex>
			</ModalContent>
		</Modal>
	);
};
