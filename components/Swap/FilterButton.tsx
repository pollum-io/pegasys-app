import { ListItem, List } from "@chakra-ui/react";
import { periodsMockedData } from "helpers/mockedData";
import { usePicasso } from "hooks";
import { FunctionComponent } from "react";
import { IChartComponentPeriod } from "types";

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
			gap="2"
		>
			{periodsMockedData.map(periods => (
				<ListItem
					key={periods.id}
					bgColor={
						id === periods.id ? theme.bg.candleGraphColor : "transparent"
					}
					color={id === periods.id ? "white" : theme.text.stakeMode}
					px="3"
					py="3"
					w="42px"
					h="42px"
					display="flex"
					alignItems="center"
					justifyContent="center"
					fontWeight="400"
					borderRadius="full"
					_hover={{
						cursor: "pointer",
						background: theme.bg.candleGraphColor,
						color: "white",
					}}
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
