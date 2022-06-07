import { Button, Flex, Img, Link, Text, useDisclosure } from '@chakra-ui/react';
import { AddLiquidityModal } from 'components';
import { ImportPoolModal } from 'components/Modals/ImportPool';
import { DefaultTemplate } from 'container';
import { usePicasso } from 'hooks';
import { NextPage } from 'next';
import { useState } from 'react';

export const PoolsContainer: NextPage = () => {
	const theme = usePicasso();
	const { onOpen, isOpen, onClose } = useDisclosure();
	const {
		onOpen: onOpenPool,
		isOpen: isOpenPool,
		onClose: onClosePool,
	} = useDisclosure();
	const [isCreate, setIsCreate] = useState(false);
	return (
		<DefaultTemplate>
			<AddLiquidityModal
				isModalOpen={isOpen}
				onModalClose={onClose}
				isCreate={isCreate}
			/>
			<ImportPoolModal isModalOpen={isOpenPool} onModalClose={onClosePool} />
			<Flex
				w="100%"
				h="100%"
				alignItems="flex-start"
				justifyContent="center"
				pt="24"
			>
				<Flex flexDirection="column" maxW="xl">
					<Flex
						flexDirection="column"
						zIndex="docked"
						position="relative"
						borderRadius="xl"
						backgroundColor="blue.700"
					>
						<Img
							borderRadius="xl"
							src="images/backgrounds/1.png"
							position="absolute"
							zIndex="base"
							w="100%"
							h="100%"
							objectFit="none"
							opacity="0.4"
							objectPosition="25% 20%"
						/>
						<Flex zIndex="docked" flexDirection="column" px="4" py="4" gap="3">
							<Text fontWeight="medium" color="white">
								Liquidity provider rewards
							</Text>
							<Text fontWeight="medium" fontSize="sm" color="white">
								Liquidity providers earn a 0.25% fee on all trades proportional
								to their share of the pool. Fees are added to the pool, accrue
								in real time and can be claimed by withdrawing your liquidity.
							</Text>
						</Flex>
					</Flex>
					<Flex
						alignItems="flex-start"
						my="8"
						justifyContent="flex-start"
						w="100%"
						flexDirection="column"
					>
						<Link
							href="https://info.pegasys.finance/accounts"
							color={theme.text.mono}
							target="_blank"
							textDecoration="underline"
							fontSize="lg"
							fontWeight="medium"
						>
							View your staked liquidity
						</Link>
						<Flex
							mt="4"
							flexDirection="row"
							justifyContent="space-between"
							w="100%"
						>
							<Text fontSize="20" fontWeight="medium">
								Your liquidity
							</Text>
							<Flex gap="4">
								<Button
									fontSize="14"
									py="2"
									px="2"
									h="max-content"
									bgColor="transparent"
									borderWidth="1px"
									borderColor={theme.bg.button.primary}
									opacity="0.8"
									_hover={{ opacity: '1' }}
									_active={{}}
									onClick={() => {
										setIsCreate(true);
										onOpen();
									}}
								>
									Create a pair
								</Button>
								<Button
									fontSize="14"
									py="2"
									px="2"
									h="max-content"
									bgColor={theme.bg.button.primary}
									color="white"
									opacity="0.8"
									_hover={{ opacity: '1' }}
									_active={{}}
									onClick={() => {
										setIsCreate(false);
										onOpen();
									}}
								>
									Add liquidity
								</Button>
							</Flex>
						</Flex>
					</Flex>
					<Flex
						w="100%"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						fontWeight="normal"
						gap="16"
					>
						<Text color={theme.text.mono} opacity="0.6" w="max-content">
							Connect a wallet to view your liquidity.
						</Text>
						<Text color={theme.text.mono} fontSize="sm" w="max-content">
							Don&apos;t see a pool you joined?{' '}
							<Button fontWeight="medium" onClick={onOpenPool}>
								Import it.
							</Button>
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</DefaultTemplate>
	);
};
