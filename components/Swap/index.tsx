import {
	Button,
	ButtonProps,
	Flex,
	IconButton,
	Input,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	Text,
} from '@chakra-ui/react';
import { usePicasso } from 'hooks';
import { FunctionComponent, ReactNode } from 'react';
import { BiDownArrowAlt } from 'react-icons/Bi';

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const Swap: FunctionComponent<IButtonProps> = props => {
	const theme = usePicasso();

	return (
		<Flex pt="6.25rem" zIndex="1">
			<Flex
				height="23rem"
				width="26.25rem"
				backgroundColor="#212429"
				margin="0 auto"
				position="relative"
				borderRadius="1.875rem"
				p="1rem"
				flexDirection="column"
			>
				<Flex
					borderRadius="1.25rem"
					width="100%"
					height="max-content"
					p="0.5rem"
					border="1px solid #2c2f36"
					flexDirection="column"
				>
					<Flex
						flexDirection="row"
						justifyContent="space-between"
						pb="0.2rem"
						color="#c3c5cb"
					>
						<Text fontSize="0.875rem">From</Text>
						<Text fontSize="0.875rem">Balance: 31321</Text>
					</Flex>
					<Flex alignItems="center" justifyContent="space-around">
						<Flex alignItems="center">
							<Input
								fontSize="1.5rem"
								border="none"
								placeholder="0.0"
								width="60%"
								mt="0.5rem"
								fontFamily="mono"
							/>
							<Button
								fontSize="0.875rem"
								height="1.75rem"
								fontWeight="500"
								ml="0.5rem"
								p="0.5rem"
							>
								MAX
							</Button>
						</Flex>
						<Popover>
							<PopoverTrigger {...props}>
								<Button
									borderRadius="0.75rem"
									m="0rem"
									p="0rem"
									width="40%"
									fontSize="1.25rem"
								>
									SYS <BiDownArrowAlt />
								</Button>
							</PopoverTrigger>
							<PopoverContent
								right="8rem"
								position="relative"
								w="30rem"
								backgroundColor="#212429"
							>
								<PopoverCloseButton />
								<Flex p="1rem">Select a token!</Flex>
								<PopoverBody>
									<Input
										borderRadius="1.25rem"
										placeholder="Search name or paste address"
									/>
								</PopoverBody>
								<PopoverHeader
									display="flex"
									flexDirection="row"
									justifyContent="space-between"
								>
									Token Name
									<Flex
										borderRadius="0.5rem"
										backgroundColor="#2c2f36"
										p="0.3rem"
										cursor="pointer"
									>
										<BiDownArrowAlt />
									</Flex>
								</PopoverHeader>
								<PopoverBody
									display="flex"
									flexDirection="row"
									justifyContent="space-between"
								>
									<Flex>☀ SYS</Flex>
									<Flex>0.31234</Flex>
								</PopoverBody>
							</PopoverContent>
						</Popover>
					</Flex>
				</Flex>
				<Flex margin="0 auto" p="0.8rem 0">
					<BiDownArrowAlt />
				</Flex>
				<Flex
					borderRadius="1.25rem"
					width="100%"
					height="max-content"
					p="0.5rem"
					border="1px solid #2c2f36"
					flexDirection="column"
				>
					<Flex
						flexDirection="row"
						justifyContent="space-between"
						pb="0.2rem"
						color="#c3c5cb"
					>
						<Text fontSize="0.875rem">To</Text>
						<Text fontSize="0.875rem">Balance: -</Text>
					</Flex>
					<Flex alignItems="center" justifyContent="space-around">
						<Flex alignItems="center">
							<Input
								fontSize="1.5rem"
								border="none"
								placeholder="0.0"
								width="60%"
								mt="0.5rem"
								fontFamily="mono"
							/>
							<Button
								fontSize="0.875rem"
								height="1.75rem"
								fontWeight="500"
								ml="0.5rem"
								p="0.5rem"
							>
								MAX
							</Button>
						</Flex>
						<Popover>
							<PopoverTrigger {...props}>
								<Button
									borderRadius="0.75rem"
									m="0rem"
									p="0rem"
									width="80%"
									fontSize="1rem"
								>
									<Text>Select a token</Text> <BiDownArrowAlt />
								</Button>
							</PopoverTrigger>
							<PopoverContent
								right="8rem"
								position="relative"
								w="30rem"
								backgroundColor="#212429"
							>
								<PopoverCloseButton />
								<Flex p="1rem">Select a token!</Flex>
								<PopoverBody>
									<Input
										borderRadius="1.25rem"
										placeholder="Search name or paste address"
									/>
								</PopoverBody>
								<PopoverHeader
									display="flex"
									flexDirection="row"
									justifyContent="space-between"
								>
									Token Name
									<Flex
										borderRadius="0.5rem"
										backgroundColor="#2c2f36"
										p="0.3rem"
										cursor="pointer"
									>
										<BiDownArrowAlt />
									</Flex>
								</PopoverHeader>
								<PopoverBody
									display="flex"
									flexDirection="row"
									justifyContent="space-between"
								>
									<Flex>☀ SYS</Flex>
									<Flex>0.31234</Flex>
								</PopoverBody>
							</PopoverContent>
						</Popover>
					</Flex>
				</Flex>
				<Flex justifyContent="space-between" p="0.8rem 0">
					<Text fontSize="0.875rem">Slippage Tolerance</Text>
					<Text fontSize="0.875rem">1.01%</Text>
				</Flex>
				<Flex>
					<Button w="100%" p="2rem" borderRadius="0.75rem">
						Enter an ammount
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
};
