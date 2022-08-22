import { Flex, theme } from "@chakra-ui/react";
import { createChart, ColorType, UTCTimestamp } from "lightweight-charts";
import React, { useEffect, useRef } from "react";
import { IChartComponentData } from "types/index";

interface IChartComponentProps {
	data: IChartComponentData[];
}

const colors = {
	backgroundColor: "transparent",
	textColor: "#4A5568",
	upColor: "#25855A",
	borderColor: "#718096",
	downColor: "#C53030",
	borderVisible: false,
	wickUpColor: "#25855A",
	wickDownColor: "#C53030",
};

const ChartComponent = (props: IChartComponentProps) => {
	const { data } = props;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const chartContainerRef: any = useRef();

	useEffect(() => {
		const chart = createChart(chartContainerRef.current, {
			layout: {
				background: { type: ColorType.Solid, color: colors.backgroundColor },
				textColor: colors.textColor,
				fontSize: 16,
			},
			width: chartContainerRef.current.clientWidth,
			height: 350,
			grid: {
				vertLines: {
					visible: false,
				},
				horzLines: {
					visible: false,
				},
			},
			rightPriceScale: {
				visible: true,
				borderColor: colors.borderColor,
				scaleMargins: {
					bottom: 0.05,
				},
			},
			timeScale: {
				visible: true,
				borderColor: colors.borderColor,
				timeVisible: true,
				lockVisibleTimeRangeOnResize: true,
			},
		});

		chart.timeScale().fitContent();

		const handleResize = () => {
			chart.applyOptions({ width: chartContainerRef.current.clientWidth });
		};

		const newSeries = chart.addCandlestickSeries({
			upColor: colors.upColor,
			downColor: colors.downColor,
			borderVisible: false,
			wickUpColor: colors.wickUpColor,
			wickDownColor: colors.wickDownColor,
		});

		const convertedDataValuesAndTypes = data.map(
			({
				time: oldTime,
				open: oldOpen,
				high: oldHigh,
				low: oldLow,
				close: oldClose,
			}) => {
				const [time, open, high, low, close] = [
					oldTime as UTCTimestamp,
					parseFloat(oldOpen) as number,
					parseFloat(oldHigh) as number,
					parseFloat(oldLow) as number,
					parseFloat(oldClose) as number,
				];

				return {
					time,
					open,
					high,
					low,
					close,
				};
			}
		);

		newSeries.setData(convertedDataValuesAndTypes.reverse());

		chart.timeScale().setVisibleLogicalRange({
			from: convertedDataValuesAndTypes.length - 20,
			to: convertedDataValuesAndTypes.length,
		});

		window.addEventListener("resize", handleResize);

		// eslint-disable-next-line
		return () => {
			window.removeEventListener("resize", handleResize);

			chart.remove();
		};
	}, [
		data,
		colors.backgroundColor,
		colors.textColor,
		colors.upColor,
		colors.downColor,
		colors.borderVisible,
		colors.wickUpColor,
		colors.wickDownColor,
	]);

	return <Flex ref={chartContainerRef} />;
};

export default ChartComponent;
