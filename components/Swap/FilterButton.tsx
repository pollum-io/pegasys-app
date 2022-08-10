import { ListItem, Flex } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, ReactNode, useState } from "react";
import {
	ONE_HOUR_IN_SECONDS,
	ONE_DAY_IN_SECONDS,
	FIVE_MINUTES_IN_SECONDS,
	FIFTEEN_MINUTES_IN_SECONDS,
	FOUR_HOURS_IN_SECONDS,
	ONE_WEEK_IN_SECONDS,
} from "helpers/consts";

interface IFilterPorps {
	children?: ReactNode;
}

export const FilterButton: FunctionComponent<IFilterPorps> = () => {
	const theme = usePicasso();
	const [filter, setFilter] = useState<string>("");

	return (
		<Flex
			flexDirection="row"
			w="100%"
			display="flex"
			alignItems="center"
			flexWrap="nowrap"
			justifyContent="center"
			gap="5"
		>
			<ListItem
				bgColor={filter === "1" ? theme.bg.blueNavy : "transparent"}
				color={filter === "1" ? theme.text.mono : "#7a8dae"}
				w="8%"
				px="3"
				py="3"
				fontWeight="semibold"
				borderRadius="full"
				_hover={{ cursor: "pointer", background: theme.bg.blueNavy }}
				value={FIVE_MINUTES_IN_SECONDS}
				onClick={() => setFilter("1")}
			>
				5m
			</ListItem>
			<ListItem
				bgColor={filter === "2" ? theme.bg.blueNavy : "transparent"}
				color={filter === "2" ? theme.text.mono : "#7a8dae"}
				px="3"
				py="3"
				fontWeight="semibold"
				borderRadius="full"
				_hover={{ cursor: "pointer", background: theme.bg.blueNavy }}
				value={FIFTEEN_MINUTES_IN_SECONDS}
				onClick={() => setFilter("2")}
			>
				15m
			</ListItem>
			<ListItem
				bgColor={filter === "3" ? theme.bg.blueNavy : "transparent"}
				color={filter === "3" ? theme.text.mono : "#7a8dae"}
				w="8%"
				textAlign="center"
				py="3"
				fontWeight="semibold"
				borderRadius="full"
				_hover={{ cursor: "pointer", background: theme.bg.blueNavy }}
				value={ONE_HOUR_IN_SECONDS}
				onClick={() => setFilter("3")}
			>
				1h
			</ListItem>
			<ListItem
				bgColor={filter === "4" ? theme.bg.blueNavy : "transparent"}
				color={filter === "4" ? theme.text.mono : "#7a8dae"}
				w="8%"
				textAlign="center"
				py="3"
				fontWeight="semibold"
				borderRadius="full"
				_hover={{ cursor: "pointer", background: theme.bg.blueNavy }}
				value={FOUR_HOURS_IN_SECONDS}
				onClick={() => setFilter("4")}
			>
				4h
			</ListItem>
			<ListItem
				bgColor={filter === "5" ? theme.bg.blueNavy : "transparent"}
				color={filter === "5" ? theme.text.mono : "#7a8dae"}
				w="8%"
				textAlign="center"
				py="3"
				fontWeight="semibold"
				borderRadius="full"
				_hover={{ cursor: "pointer", background: theme.bg.blueNavy }}
				value={ONE_DAY_IN_SECONDS}
				onClick={() => setFilter("5")}
			>
				1d
			</ListItem>
			<ListItem
				bgColor={filter === "6" ? theme.bg.blueNavy : "transparent"}
				color={filter === "6" ? theme.text.mono : "#7a8dae"}
				w="8%"
				textAlign="center"
				py="3"
				fontWeight="semibold"
				borderRadius="full"
				_hover={{ cursor: "pointer", background: theme.bg.blueNavy }}
				value={ONE_WEEK_IN_SECONDS}
				onClick={() => setFilter("6")}
			>
				1w
			</ListItem>
		</Flex>
	);
};
