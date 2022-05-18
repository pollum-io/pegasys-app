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
import { IoIosArrowDown } from 'react-icons/Io';
import { FcInfo } from 'react-icons/Fc'

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const Swap: FunctionComponent<IButtonProps> = props => {
	const theme = usePicasso();

	return (
		<Flex pt="24" zIndex="1">
			<Flex
				height="max-content"
				width="22%"
				bgColor={theme.bg.swap}
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
						<Text fontSize="sm" fontWeight="500">From</Text>
						<Text fontSize="sm" fontWeight="500">Balance: 31321</Text>
					</Flex>
					<Flex alignItems="center" justifyContent="space-around">
						<Flex alignItems="center" >
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
							<Button
								fontSize="sm"
								height="max-content"
								fontWeight="500"
								ml="2"
								px="2"
								py="1.5"
								borderRadius="8"
								color={theme.text.cyanPegasys}
								bgColor={theme.bg.button.swapBlue}
							>
								MAX
							</Button>
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
								<FcInfo/>
								<Text fontSize="xl" fontWeight="500" px="3">SYS</Text>
								<IoIosArrowDown />
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				<Flex margin="0 auto" py="4">
					<BiDownArrowAlt />
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
						<Text fontSize="sm">To</Text>
						<Text fontSize="sm">-</Text>
					</Flex>
					<Flex alignItems="center" justifyContent="space-around">
						<Flex alignItems="center">
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
							<Flex cursor="pointer" flexDirection="row" alignItems="center" bgColor={theme.bg.button.swapBlue} px="3" py="1" ml="5" borderRadius={12}>
								<Text fontWeight="500" pr="2" fontSize="md" color={theme.text.cyanPegasys}>Select a token</Text>
								<IoIosArrowDown />
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				<Flex justifyContent="space-between" fontWeight={500} py="4" px="3" color={theme.text.swapInfo}>
					<Text fontSize="sm">Slippage Tolerance</Text>
					<Text fontSize="sm">1.01%</Text>
				</Flex>
				<Flex>
					<Button w="100%" p="8" borderRadius="12" fontSize="xl">
						Enter an ammount
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
};
