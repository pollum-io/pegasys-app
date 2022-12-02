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
				mt={["0", "6rem", "6rem", "6rem"]}
				mb={["0", "unset", "unset", "unset"]}
				position={["absolute", "relative", "relative", "relative"]}
				bottom="0"
				w={["100vw", "32rem", "32rem", "32rem"]}
				borderTopRadius={["30px", "30px", "30px", "30px"]}
				borderBottomRadius={["0px", "30px", "30px", "30px"]}
				boxShadow="0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)"
				borderTop={["1px solid transparent", "none", "none", "none"]}
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					backgroundColor={theme.bg.blueNavyLight}
					borderTopRadius="30px"
					alignItems="baseline"
					justifyContent="space-between"
					pl={["4", "5", "5", "5"]}
				>
					<Flex
						flex="1"
						display={{
							base: "flex",
							sm: "none",
							md: "none",
							lg: "none",
						}}
						justifyContent="left"
						gap="2"
						onClick={onClose}
						color={theme.text.callGray}
						alignItems="center"
					>
						<MdArrowBack size={22} />
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
					borderBottomRadius={["0", "20px", "20px", "20px"]}
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
							pb={["3rem", "1.5rem", "1.5rem", "1.5rem"]}
							background={[
								theme.bg.subModalMobile,
								theme.bg.subModal,
								theme.bg.subModal,
								theme.bg.subModal,
							]}
							position={["relative", "absolute", "absolute", "absolute"]}
							w="100%"
							top={
								withdrawPercentage === 100
									? ["0", "25rem", "25rem", "25rem"]
									: ["0", "23rem", "23rem", "23rem"]
							}
							borderTopRadius={["0", "30px", "30px", "30px"]}
							borderBottomRadius={["0", "30px", "30px", "30px"]}
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
							pb={["3rem", "1.5rem", "1.5rem", "1.5rem"]}
							background={[
								theme.bg.subModalMobile,
								theme.bg.subModal,
								theme.bg.subModal,
								theme.bg.subModal,
							]}
							position={["relative", "absolute", "absolute", "absolute"]}
							w="100%"
							top={["unset", "19.5rem", "19.5rem", "19.5rem"]}
							borderTopRadius={["0", "30px", "30px", "30px"]}
							borderBottomRadius={["0", "30px", "30px", "30px"]}
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
