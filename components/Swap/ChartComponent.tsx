import { Flex } from "@chakra-ui/react";
import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef } from "react";

const ChartComponent = (props: any) => {
	const {
		data,
		colors: {
			backgroundColor = "black",
			textColor = "#718096",
			upColor = "#25855A",
			downColor = "#C53030",
			borderVisible = false,
			wickUpColor = "#25855A",
			wickDownColor = "#C53030",
		},
	} = props;

	const chartContainerRef: any = useRef();

	useEffect(() => {
		const chart = createChart(chartContainerRef.current, {
			layout: {
				background: { type: ColorType.Solid, color: backgroundColor },
				textColor,
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

		const newSeries = chart.addCandlestickSeries({
			upColor: "#25855A",
			downColor: "#C53030",
			borderVisible: false,
			wickUpColor: "#26a69a",
			wickDownColor: "transparent",
		});
		newSeries.setData(data);

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);

			chart.remove();
		};
	}, [
		data,
		backgroundColor,
		textColor,
		upColor,
		downColor,
		borderVisible,
		wickUpColor,
		wickDownColor,
	]);

	return <Flex ref={chartContainerRef} />;
};

export default ChartComponent;
