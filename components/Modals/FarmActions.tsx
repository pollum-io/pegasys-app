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

import { useFarm, useEarn } from "pegasys-services";
import React from "react";
import { MdOutlineInfo } from "react-icons/md";
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
				mt={["8rem", "8", "10rem", "10rem"]}
				mb={["0", "0", "10rem", "10rem"]}
				position={["fixed", "fixed", "relative", "relative"]}
				bottom="0"
				maxWidth="max-content"
				w={["100vw", "100vw", "max-content", "max-content"]}
				h={["max-content", "100vh", "max-content", "max-content"]}
				borderTopRadius={["3xl", "3xl", "3xl", "3xl"]}
				borderBottomRadius={["0px", "0", "3xl", "3xl"]}
				bgColor={theme.bg.blueNavyLight}
				border={["none", "1px solid transparent"]}
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					backgroundColor={theme.bg.blueNavyLight}
					borderTopRadius="3xl"
					alignItems="baseline"
					justifyContent="space-between"
					pl={["4", "5", "20", "20"]}
				>
					<EarnActionsHeader
						onClose={onClose}
						depositTitle="Deposit"
						withdrawTitle="Withdraw"
						claimTitle="Claim"
					/>
				</ModalHeader>
				<ModalBody
					mb="2"
					borderBottomRadius={["0", "0", "3xl", "3xl"]}
					background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
				>
					<EarnDepositAction
						sign={sign}
						buttonTitle="Deposit"
						deposit={deposit}
					/>
					<EarnWithdrawAction
						onClose={onClose}
						buttonTitle="Withdraw"
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
							bottom={["unset", "unset", "-9rem", "-9rem"]}
							borderTopRadius={["0", "0", "3xl", "3xl"]}
							borderBottomRadius={["0", "0", "3xl", "3xl"]}
							alignItems="flex-start"
							gap="2"
							mt={withdrawPercentage === 100 ? "3rem" : "1rem"}
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
									<Text>
										When you withdraw, your PSYS is claimed and your Pegasys
										Liquidity tokens, PLP, are returned to you. You will no
										longer earn PSYS rewards on this liquidity. Your original
										token liquidity will remain in its liquidity pool.
									</Text>
								) : (
									<Text>
										When you withdraw, your Pegasys Liquidity Tokens, PLP, are
										returned to you. Your original token liquidity will remain
										in its liquidity pool.
									</Text>
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
							bottom={["unset", "unset", "-7rem", "-7rem"]}
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
								<Text>
									Please note that when you claim without withdrawing your
									liquidity remains in the mining pool.
								</Text>
							</Flex>
						</Flex>
					)}
				</Flex>
			</ModalContent>
		</Modal>
	);
};
