import { Flex } from "@chakra-ui/react";
import { createChart, ColorType, UTCTimestamp } from "lightweight-charts";
import React, { useEffect, useRef } from "react";
import { IChartComponentData } from "types/index";

interface IChartComponentProps {
	data: IChartComponentData[];
}

const colors = {
	backgroundColor: "transparent",
	textColor: "#718096",
	upColor: "#25855A",
	downColor: "#C53030",
	borderVisible: false,
	wickUpColor: "#25855A",
	wickDownColor: "#C53030",
};

const initialData = [
	{ open: 10, high: 10.63, low: 9.49, close: 9.55, time: 1642427876 },
	{ open: 9.55, high: 10.3, low: 9.42, close: 9.94, time: 1642514276 },
	{ open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: 1642600676 },
	{ open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: 1642687076 },
	{ open: 9.51, high: 10.46, low: 9.1, close: 10.17, time: 1642773476 },
	{ open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: 1642859876 },
	{ open: 10.47, high: 11.39, low: 10.4, close: 10.81, time: 1642946276 },
	{ open: 10.81, high: 11.6, low: 10.3, close: 10.75, time: 1643032676 },
	{ open: 10.75, high: 11.6, low: 10.49, close: 10.93, time: 1643119076 },
	{ open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1643205476 },
];

const ChartComponent = (props: IChartComponentProps) => {
	const { data } = props;

	const chartContainerRef: any = useRef();

	useEffect(() => {
		if (data.length === 0) return;

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
			leftPriceScale: {
				visible: false,
				borderColor: "#718096",
				scaleMargins: {
					bottom: 0,
				},
			},
			rightPriceScale: {
				visible: true,
				borderColor: "#718096",
				scaleMargins: {
					bottom: 0,
				},
			},
			timeScale: {
				visible: true,
				borderColor: "#718096",
				timeVisible: true,
				lockVisibleTimeRangeOnResize: true,
			},
		});
		chart.timeScale().fitContent();

		const handleResize = () => {
			chart.applyOptions({ width: chartContainerRef.current.clientWidth });
		};

		const removeListener = () => {
			window.removeEventListener("resize", handleResize);

			chart.remove();
		};

		const newSeries = chart.addCandlestickSeries({
			upColor: colors.upColor,
			downColor: colors.downColor,
			borderVisible: false,
			wickUpColor: colors.wickUpColor,
			wickDownColor: colors.wickDownColor,
		});

		const newArray = data.map(
			(
				{ close: oldClose, high: oldHigh, low: oldLow, open: oldOpen },
				index
			) => {
				const [close, high, low, open, time] = [
					parseFloat(oldClose) as number,
					parseFloat(oldHigh) as number,
					parseFloat(oldLow) as number,
					parseFloat(oldOpen) as number,
					data[index].time as UTCTimestamp,
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

		newSeries.setData(initialData);

		window.addEventListener("resize", handleResize);

		removeListener();
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
