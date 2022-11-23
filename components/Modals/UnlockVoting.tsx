import {
	Flex,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, useState } from "react";

import {
	UnlockVotingHeader,
	UnlockVotingBody,
	UnlockVotingInput,
	UnlockVotingFooter,
} from "../governance";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const UnlockVotesModal: FunctionComponent<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const [showInput, setShowInput] = useState(false);
	const [inputValue, setInputValue] = useState<string>("");

	const close = () => {
		setInputValue("");
		setShowInput(false);
		onClose();
	};

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={close}>
			<ModalOverlay />
			<ModalContent
				borderRadius="30px"
				my={["0", "40", "40", "40"]}
				h="max-content"
				position={["absolute", "relative", "relative", "relative"]}
				bgColor={theme.bg.blueNavyLight}
				bottom="0"
				w="100vw"
			>
				<ModalHeader pt="1.5rem" pb="1rem" flexDirection="column">
					<UnlockVotingHeader onClose={close} />
				</ModalHeader>
				<ModalBody pb="6">
					<Flex w="100%" flexDirection="column" gap="8">
						<UnlockVotingBody />
						<UnlockVotingInput
							inputValue={inputValue}
							setInputValue={setInputValue}
							showInput={showInput}
						/>
					</Flex>
				</ModalBody>

				<ModalFooter pt="0.5rem" pb="1.5rem">
					<UnlockVotingFooter
						setShowInput={setShowInput}
						inputValue={inputValue}
						showInput={showInput}
						onClose={close}
					/>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
