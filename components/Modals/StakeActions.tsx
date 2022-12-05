import {
	Flex,
	Icon,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
	useMediaQuery,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { useEarn, useStake } from "pegasys-services";
import React from "react";
import { useTranslation } from "react-i18next";
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

export const StakeActions: React.FC<IModal> = props => {
	const { isOpen, onClose: close } = props;
	const theme = usePicasso();
	const { claim, stake, unstake, sign } = useStake();
	const { selectedOpportunity, buttonId, reset, withdrawPercentage } =
		useEarn();
	const [isMobile] = useMediaQuery("(max-width: 480px)");
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
				h="max-content"
				borderRadius="1.875rem"
				bgColor={theme.bg.blueNavyLight}
				borderTop={["1px solid transparent", "none", "none", "none"]}
				borderBottomRadius={["0px", "1.875rem", "1.875rem", "1.875rem"]}
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					backgroundColor={theme.bg.blueNavyLight}
					borderTopRadius="1.875rem"
					alignItems="baseline"
					justifyContent="space-between"
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
						<Text>Stake</Text>
					</Flex>
					<EarnActionsHeader
						onClose={onClose}
						depositTitle={t("earnPages.stake")}
						withdrawTitle={t("earnPages.unstake")}
						claimTitle={t("earnPages.claim")}
					/>
				</ModalHeader>
				<ModalBody>
					<EarnDepositAction sign={sign} buttonTitle="Stake" deposit={stake} />
					<EarnWithdrawAction
						onClose={onClose}
						buttonTitle={t("earnPages.unstake")}
						withdraw={unstake}
					/>
					<EarnClaimAction claim={claim} />
				</ModalBody>
				<Flex>
					{buttonId === "withdraw" && (
						<Flex
							flexDirection="row"
							p="1.5rem"
							pb={["3rem", "1.5rem", "1.5rem", "1.5rem"]}
							background={
								isMobile ? theme.bg.subModalMobile : theme.bg.subModal
							}
							position={["relative", "absolute", "absolute", "absolute"]}
							w="100%"
							top={
								withdrawPercentage === 100
									? ["unset", "25rem", "25rem", "25rem"]
									: ["unset", "23rem", "23rem", "23rem"]
							}
							borderRadius={["0", "30px", "30px", "30px"]}
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
								<Text>
									{withdrawPercentage === 100
										? t("earn.unstakeEntire")
										: t("earnPages.stakeWithdrawTooltip")}
								</Text>
							</Flex>
						</Flex>
					)}
					{buttonId === "claim" && (
						<Flex
							flexDirection="row"
							p="1.5rem"
							pb={["3rem", "1.5rem", "1.5rem", "1.5rem"]}
							background={
								isMobile ? theme.bg.subModalMobile : theme.bg.subModal
							}
							position={["relative", "absolute", "absolute", "absolute"]}
							w="100%"
							top={["unset", "19.5rem", "19.5rem", "19.5rem"]}
							borderRadius={["0", "30px", "30px", "30px"]}
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
								<Text>{t("earnPages.stakingClaimTooltip")}</Text>
							</Flex>
						</Flex>
					)}
				</Flex>
			</ModalContent>
		</Modal>
	);
};
