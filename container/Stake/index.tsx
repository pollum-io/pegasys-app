import { Button, Flex, Img, Text } from '@chakra-ui/react';
import { DefaultTemplate } from 'container';
import { usePicasso } from 'hooks';
import { NextPage } from 'next';

export const StakeContainer: NextPage = () => {
	const theme = usePicasso();

	return (
		<DefaultTemplate>
			<Flex
				w="100%"
				h="100%"
				alignItems="flex-start"
				justifyContent="center"
				pt="24"
			>
				<Flex flexDirection="column" maxW="xl" h="100%" gap="5">
					<Flex
						flexDirection="column"
						zIndex="docked"
						position="relative"
						borderRadius="xl"
						minW="xl"
						h="81px"
					>
						<Img
							borderRadius="xl"
							src="images/backgrounds/2.png"
							position="absolute"
							zIndex="base"
							w="100%"
							h="100%"
							objectFit="none"
							opacity="0.9"
							objectPosition="10% 1%"
						/>
						<Flex zIndex="docked" flexDirection="column" px="4" py="4" gap="1">
							<Text fontWeight="medium" color="white">
								Pegasys PSYS staking
							</Text>
							<Text fontWeight="medium" fontSize="sm" color="white">
								Deposit and stake your PSYS tokens to earn more tokens.
							</Text>
						</Flex>
					</Flex>

					<Flex flexDirection="column" fontSize="xl" gap="3">
						<Text fontWeight="medium">Current opportunities</Text>

						<Flex flexDirection="column" gap="3">
							<Flex
								flexDirection="column"
								zIndex="docked"
								position="relative"
								borderRadius="xl"
								h="147px"
								background="linear-gradient(160deg, rgba(0, 147, 233, 0.8) 0%, rgba(128, 208, 199, 0.8) 100%)"
							>
								<Img
									borderRadius="xl"
									src="images/backgrounds/stakeImageCard.png"
									position="absolute"
									zIndex="base"
									w="100%"
									h="100%"
									objectFit="none"
									opacity="0.6"
									objectPosition="20% 5%"
								/>
								<Flex
									zIndex="docked"
									flexDirection="column"
									px="4"
									py="4"
									gap="3"
								>
									<Flex
										w="100%"
										justifyContent="space-between"
										alignItems="center"
									>
										<Flex alignItems="center">
											<Img src="icons/pegasys.png" w="24px" h="24px" />
											<Text
												ml="2"
												color="white"
												fontWeight={600}
												fontSize="2xl"
											>
												Earn PSYS
											</Text>
										</Flex>
										<Button
											backgroundColor={theme.bg.button.primary}
											color="white"
										>
											Deposit
										</Button>
									</Flex>
									<Flex flexDirection="column" w="100%" gap="3">
										<Flex
											w="100%"
											justifyContent="space-between"
											alignItems="center"
										>
											<Text fontSize="md" color="white">
												Total staked
											</Text>
											<Text fontSize="md" color="white">
												$1,422,000
											</Text>
										</Flex>

										<Flex
											w="100%"
											justifyContent="space-between"
											alignItems="center"
										>
											<Text fontSize="md" color="white">
												APR
											</Text>
											<Text fontSize="md" color="white">
												10%
											</Text>
										</Flex>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</DefaultTemplate>
	);
};
