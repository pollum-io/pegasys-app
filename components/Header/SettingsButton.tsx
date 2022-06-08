import {
	ButtonProps,
	Popover,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	Flex,
	Text,
	Input,
	Stack,
	Switch,
} from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { FiSettings } from "react-icons/fi";
import { usePicasso } from "hooks";
import { IconButton } from "../Buttons/IconButton";
import { SlippageButton } from "../Buttons/SlippageButton";
import { Languages } from "./Languages";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const SettingsButton: FunctionComponent<IButtonProps> = props => {
	const theme = usePicasso();

	return (
		<Popover>
			<PopoverTrigger {...props}>
				<IconButton aria-label="Popover" icon={<FiSettings />} />
			</PopoverTrigger>
			<PopoverContent
				left="96rem"
				top="4rem"
				w="75%"
				bgColor={theme.bg.bgPrimary}
			>
				<PopoverCloseButton />
				<PopoverHeader>
					<Text fontSize="sm" fontWeight={600}>
						Transaction Settings
					</Text>
				</PopoverHeader>
				<PopoverBody>
					<Text fontSize="sm" fontWeight={400} pb="2">
						Slippage tolerance
					</Text>
					<SlippageButton aria-label="Slip">0.1%</SlippageButton>
					<SlippageButton aria-label="Slip">0.5%</SlippageButton>
					<SlippageButton aria-label="Slip">1.01%</SlippageButton>
					<Input
						px="1"
						py="1"
						w="35%"
						h="max-content"
						m="0"
						borderRadius={36}
						placeholder="1.0%"
						fontWeight={400}
						backgroundColor={theme.bg.whiteGray}
						border="1px solid"
						borderColor={theme.border.borderSettings}
						color={theme.text.mono}
						fontFamily="mono"
						letterSpacing="-0.8px"
					/>

					<Text fontSize="sm" fontWeight={400} pt="4">
						Transaction deadline
					</Text>
					<Flex flexDirection="row" alignItems="center" pt="2">
						<Input
							px="2"
							py="1"
							w="30%"
							h="max-content"
							borderRadius={36}
							placeholder="1.0%"
							fontWeight={400}
							backgroundColor={theme.bg.whiteGray}
						/>
						<Text fontSize="sm" fontWeight={400} pl="2">
							minutes
						</Text>
					</Flex>

					<Text fontSize="sm" fontWeight={600} pt="4">
						Interface Settings
					</Text>
					<Flex alignItems="baseline" justifyContent="space-between">
						<Text fontSize="sm" fontWeight={600} pt="4">
							Toggle Expert Mode
						</Text>
						<Stack align="center" direction="row">
							<Switch size="md" colorScheme="teal" />
						</Stack>
					</Flex>
					<Flex alignItems="baseline" justifyContent="space-between">
						<Text fontSize="sm" fontWeight={600} pt="4">
							Languages
						</Text>
						<Languages />
					</Flex>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};
