import {
	Button,
	Flex,
	Icon,
	Input,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
	Tooltip,
	useDisclosure,
} from '@chakra-ui/react';
import { usePicasso } from 'hooks';
import React from 'react';
import { MdHelpOutline } from 'react-icons/md';
import { FcInfo } from 'react-icons/fc';
import { IoIosArrowDown } from 'react-icons/io';
import { BiPlus } from 'react-icons/bi';
import { SelectCoinModal } from 'components';

interface IModal {
	isModalOpen: boolean;
	onModalClose: () => void;
	isCreate: boolean;
}

export const AddLiquidityModal: React.FC<IModal> = props => {
	const { isModalOpen, onModalClose, isCreate } = props;
	const theme = usePicasso();
	const { onOpen, isOpen, onClose } = useDisclosure();

	return (
		<Modal
			blockScrollOnMount={false}
			isOpen={isModalOpen}
			onClose={onModalClose}
		>
			<SelectCoinModal isOpen={isOpen} onClose={onClose} />
			<ModalOverlay />
			<ModalContent borderRadius="xl" bgColor={theme.bg.iceGray}>
				<ModalHeader display="flex" alignItems="center">
					<Tooltip
						label="When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time."
						position="relative"
						bgColor={theme.bg.secondary}
						border="1px solid"
						borderColor={theme.border.borderSettings}
						color={theme.text.swapInfo}
						borderRadius="md"
					>
						<Text as="span" _hover={{ opacity: 0.8 }}>
							<Icon
								as={MdHelpOutline}
								h="4"
								w="4"
								color="white"
								backgroundColor="gray.800"
								borderRadius="full"
							/>
						</Text>
					</Tooltip>
					<Text
						fontSize="lg"
						fontWeight="medium"
						textAlign="center"
						margin="0 auto"
					>
						{isCreate ? 'Create a pair' : 'Add Liquidity'}
					</Text>
				</ModalHeader>
				<ModalCloseButton top="4" size="md" _focus={{}} />

				{isCreate && (
					<Flex alignItems="center" width="100%" justifyContent="center">
						<Flex
							height="20%"
							width="90%"
							borderRadius={10}
							bgColor={theme.bg.button.connectWallet}
							textAlign="left"
							p={5}
							flexDirection="column"
							gap={3}
						>
							<Text
								fontSize="md"
								fontWeight="bold"
								textAlign="left"
								color={theme.text.cyan}
							>
								You are the first liquidity provider.
							</Text>
							<Text
								fontSize="md"
								fontWeight="medium"
								textAlign="left"
								color={theme.text.cyan}
							>
								The ratio of tokens you add will set the price of this pool.
							</Text>
							<Text
								fontSize="md"
								fontWeight="medium"
								textAlign="left"
								color={theme.text.cyan}
							>
								Once you are happy with the rate click supply to review.
							</Text>
						</Flex>
					</Flex>
				)}

				<Flex flexDirection="column">
					<Flex
						height="max-content"
						width="100%"
						bgColor={theme.bg.iceGray}
						margin="0 auto"
						position="relative"
						borderRadius={30}
						p="5"
						flexDirection="column"
					>
						<Flex
							borderRadius={18}
							width="100%"
							height="max-content"
							px="3"
							py="1.5"
							border="1px solid"
							borderColor={theme.border.swapInput}
							flexDirection="column"
						>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								pb="1"
								color={theme.text.swapInfo}
							>
								<Text fontSize="sm" fontWeight="500">
									Input
								</Text>
								<Text fontSize="sm">Balance: 0</Text>
							</Flex>
							<Flex alignItems="center" justifyContent="space-around">
								<Flex alignItems="center" justifyContent="space-between">
									<Input
										fontSize="2xl"
										border="none"
										placeholder="0.0"
										width="50%"
										mt="2"
										fontFamily="mono"
										px="0.5"
										letterSpacing="-4px"
									/>
									<Flex
										alignItems="center"
										justifyContent="space-between"
										px="5"
										py="1"
										w="max-content"
										ml="2"
										borderRadius={12}
										cursor="pointer"
										_hover={{
											bgColor: theme.bg.button.swapTokenCurrency,
										}}
									>
										<FcInfo />
										<Text fontSize="xl" fontWeight="500" px="3">
											SYS
										</Text>
										<IoIosArrowDown />
									</Flex>
								</Flex>
							</Flex>
						</Flex>
						<Flex margin="0 auto" py="4">
							<BiPlus />
						</Flex>
						<Flex
							borderRadius={18}
							width="100%"
							height="max-content"
							px="3"
							py="1.5"
							border="1px solid"
							borderColor={theme.border.swapInput}
							flexDirection="column"
						>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								pb="1"
								color={theme.text.swapInfo}
							>
								<Text fontSize="sm">Input</Text>
								<Text fontSize="sm">-</Text>
							</Flex>
							<Flex alignItems="center" justifyContent="space-around">
								<Flex alignItems="center" justifyContent="space-between">
									<Input
										fontSize="2xl"
										border="none"
										placeholder="0.0"
										width="50%"
										mt="2"
										fontFamily="mono"
										px="0.5"
										letterSpacing="-4px"
									/>
									<Flex
										cursor="pointer"
										flexDirection="row"
										alignItems="center"
										bgColor={theme.bg.button.swapBlue}
										px="3"
										py="1"
										ml="5"
										borderRadius={12}
										onClick={onOpen}
									>
										<Text
											fontWeight="500"
											pr="2"
											fontSize="md"
											color={theme.text.cyan}
										>
											Select a token
										</Text>
										<IoIosArrowDown />
									</Flex>
								</Flex>
							</Flex>
						</Flex>
						<Flex mt="7">
							<Button w="100%" p="8" borderRadius="12" fontSize="xl">
								{isCreate ? 'Create a pair' : 'Add Liquidity'}
							</Button>
						</Flex>
					</Flex>
				</Flex>
			</ModalContent>
		</Modal>
	);
};
