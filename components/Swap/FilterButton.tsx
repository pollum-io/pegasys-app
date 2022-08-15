import { ListItem, List } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent } from "react";
import {
	ONE_HOUR_IN_SECONDS,
	ONE_DAY_IN_SECONDS,
	FIVE_MINUTES_IN_SECONDS,
	FIFTEEN_MINUTES_IN_SECONDS,
	FOUR_HOURS_IN_SECONDS,
	ONE_WEEK_IN_SECONDS,
} from "helpers/consts";
import { IChartComponentPeriod } from "types";

interface IPeriodsMockedData extends IChartComponentPeriod {
	inputValue: string;
}

const periodsMockedData: IPeriodsMockedData[] = [
	{
		id: 1,
		inputValue: "5m",
		period: FIVE_MINUTES_IN_SECONDS,
	},
	{
		id: 2,
		inputValue: "15m",
		period: FIFTEEN_MINUTES_IN_SECONDS,
	},
	{
		id: 3,
		inputValue: "1h",
		period: ONE_HOUR_IN_SECONDS,
	},
	{
		id: 4,
		inputValue: "4h",
		period: FOUR_HOURS_IN_SECONDS,
	},
	{
		id: 5,
		inputValue: "1d",
		period: ONE_DAY_IN_SECONDS,
	},
	{
		id: 6,
		inputValue: "1w",
		period: ONE_WEEK_IN_SECONDS,
	},
];

interface IFilterPorps {
	periodStateValue: IChartComponentPeriod;
	setPeriod: React.Dispatch<React.SetStateAction<IChartComponentPeriod>>;
}

export const FilterButton: FunctionComponent<IFilterPorps> = ({
	periodStateValue,
	setPeriod,
}) => {
	const { id } = periodStateValue;
	const theme = usePicasso();

	return (
		<List
			flexDirection="row"
			w="100%"
			display="flex"
			alignItems="center"
			flexWrap="nowrap"
			justifyContent="center"
			gap="5"
		>
			{periodsMockedData.map(periods => (
				<ListItem
					key={periods.id}
					bgColor={id === periods.id ? theme.bg.blueNavy : "transparent"}
					color={id === periods.id ? theme.text.mono : "#7a8dae"}
					px="3"
					py="3"
					fontWeight="semibold"
					borderRadius="full"
					_hover={{ cursor: "pointer", background: theme.bg.blueNavy }}
					value={periods.period}
					onClick={() =>
						setPeriod({
							id: periods.id,
							period: periods.period,
						})
					}
				>
					{periods.inputValue}
				</ListItem>
			))}
		</List>
	);
};
