import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";

import { useGovernance, ZERO_ADDRESS } from "pegasys-services";
import { usePicasso } from "hooks";
import { FaLessThan } from "react-icons/fa";
import { IUnlockVotingFooter } from "./dto";

const UnlockVotingFooter: React.FC<IUnlockVotingFooter> = ({
	showInput,
	inputValue,
	onClose,
	setShowInput,
}) => {
	const {
		votesLocked,
		onDelegate,
		setDelegatedTo,
		setVotesLocked,
		delegatedTo,
	} = useGovernance();
	const theme = usePicasso();

	const onDelegateVotes = () => {
		const isSelf =
			(votesLocked && !showInput) || inputValue.toLocaleLowerCase() === "self";

		if (inputValue === ZERO_ADDRESS) {
			setDelegatedTo("");
			setVotesLocked(true);
		} else {
			setVotesLocked(false);
			setDelegatedTo(isSelf ? "Self" : inputValue);
		}

		onDelegate(isSelf ? undefined : inputValue);
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
						fontSize="16px"
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
								? "Delegate Votes"
								: "Self Delegate"
							: "Update Vote Delegation"}
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
				fontSize="14px"
				gap="1"
				onClick={() => setShowInput(!showInput)}
			>
				{!showInput ? (
					<Flex gap="1">
						<Text>Add delegate</Text>
						<Text>+</Text>
					</Flex>
				) : (
					<Flex alignItems="baseline" gap="1">
						<FaLessThan size={10} fontWeight="normal" />
						<Text fontWeight="semibold">Back</Text>
					</Flex>
				)}
			</Flex>
		</Flex>
	);
};

export default UnlockVotingFooter;
