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
import { useEarn, useStake } from "pegasys-services";
import {
	EarnActionsHeader,
	EarnDepositAction,
	EarnClaimAction,
	EarnWithdrawAction,
} from "../Earn";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { MdArrowBack, MdOutlineClose, MdOutlineInfo } from "react-icons/md";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const StakeActions: React.FC<IModal> = props => {
	const { isOpen, onClose: close } = props;
	const theme = usePicasso();
	const { claim, stake, unstake, sign } = useStake();
	const { selectedOpportunity, buttonId, reset } = useEarn();

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
				mt={["0", "0", "10rem", "10rem"]}
				mb="0"
				position={["absolute", "absolute", "relative", "relative"]}
				bottom="0"
				w={["100vw", "100vw", "max-content", "max-content"]}
				h={["max-content", "max-content", "max-content", "max-content"]}
				borderRadius="3xl"
				bgColor={theme.bg.blueNavyLight}
				border={[
					"none",
					"none",
					"1px solid transparent",
					"1px solid transparent",
				]}
				borderBottomRadius={["0px", "0", "3xl", "3xl"]}
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					backgroundColor={theme.bg.blueNavyLight}
					borderTopRadius="3xl"
					alignItems="baseline"
					justifyContent="space-between"
				>
					<EarnActionsHeader
						onClose={onClose}
						depositTitle="Stake"
						withdrawTitle="Unstake"
						claimTitle="Claim"
					/>
				</ModalHeader>
				<ModalBody>
					<EarnDepositAction sign={sign} buttonTitle="Stake" deposit={stake} />
					<EarnWithdrawAction
						onClose={onClose}
						buttonTitle="Unstake"
						withdraw={unstake}
					/>
					<EarnClaimAction claim={claim} />
				</ModalBody>
				<Flex>
					{buttonId === "withdraw" && (
						<Flex
							flexDirection="row"
							p="1.5rem"
							background={theme.bg.subModal}
							position={["relative", "relative", "absolute", "absolute"]}
							w="100%"
							top={["unset", "unset", "24rem", "24rem"]}
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
							<Flex flexDirection="column" gap="6" color={theme.text.mono}>
								<Text>
									When you partially unstake your deposits, you will keep
									earning rewards from this staking pool proportionally to your
									remaining staked balance.
								</Text>
							</Flex>
						</Flex>
					)}
					{buttonId === "deposit" && (
						<Flex
							flexDirection="row"
							p="1.5rem"
							background={theme.bg.subModal}
							position={["relative", "relative", "absolute", "absolute"]}
							w="100%"
							top={["unset", "unset", "24rem", "23rem"]}
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
							<Flex flexDirection="column" gap="6" color={theme.text.mono}>
								<Text>
									Please note that when you claim without withdrawing your
									liquidity remains in the staking pool.
								</Text>
							</Flex>
						</Flex>
					)}
				</Flex>
			</ModalContent>
		</Modal>
	);
};
