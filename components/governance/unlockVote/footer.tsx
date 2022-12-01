import React from "react";
import { Button, Flex, Text, useMediaQuery } from "@chakra-ui/react";

import { useGovernance } from "pegasys-services";
import { usePicasso } from "hooks";
import { FaLessThan } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { IUnlockVotingFooter } from "./dto";

const UnlockVotingFooter: React.FC<IUnlockVotingFooter> = ({
	showInput,
	inputValue,
	onClose,
	setShowInput,
}) => {
	const { votesLocked, onDelegate, delegatedTo } = useGovernance();
	const theme = usePicasso();
	const { t: translation, i18n } = useTranslation();
	const { language } = i18n;
	const [isMobile] = useMediaQuery("(max-width: 480px)");

	const onDelegateVotes = async () => {
		const isSelf =
			(votesLocked && !showInput) || inputValue.toLocaleLowerCase() === "self";

		await onDelegate(isSelf ? undefined : inputValue);
		onClose();
	};

	return (
		<Flex w="100%" alignItems="center" flexDirection="column" gap="6">
			{(votesLocked || showInput) && (
				<Flex w="100%">
					<Button
						id="self"
						fontWeight="semibold"
						w="100%"
						fontSize={
							(language === "de" && isMobile) || (language === "fr" && isMobile)
								? "13px"
								: "16px"
						}
						py="0.8rem"
						bgColor={theme.bg.blueNavyLightness}
						color={theme.text.cyan}
						_hover={{
							bgColor: theme.bg.bluePurple,
						}}
						borderRadius="full"
						onClick={onDelegateVotes}
						disabled={
							votesLocked && !showInput
								? false
								: (inputValue.length < 11 &&
										inputValue.toLocaleLowerCase() !== "self") ||
								  inputValue === delegatedTo
						}
					>
						{votesLocked
							? showInput
								? translation("vote.delegateVotes")
								: translation("vote.selfDelegate")
							: translation("votePage.updateDelegation")}
					</Button>
				</Flex>
			)}
			<Flex
				pl="0.2rem"
				justifyContent="center"
				_hover={{ cursor: "pointer", opacity: "0.9" }}
				fontWeight="semibold"
				transition="100ms ease-in-out"
				textAlign="center"
				color={theme.text.cyanPurple}
				fontSize="0.875rem"
				gap="1"
				onClick={() => setShowInput(!showInput)}
			>
				{!showInput ? (
					<Flex gap="1">
						<Text>
							{translation("searchModal.add")} {translation("vote.delegate")}
						</Text>
						<Text>+</Text>
					</Flex>
				) : (
					<Flex alignItems="baseline" gap="1">
						<FaLessThan size={10} fontWeight="normal" />
						<Text fontWeight="semibold">{translation("migratePage.back")}</Text>
					</Flex>
				)}
			</Flex>
		</Flex>
	);
};

export default UnlockVotingFooter;
