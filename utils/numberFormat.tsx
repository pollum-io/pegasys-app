import Numeral from "numeral";
import { Text } from "@chakra-ui/react";

export const formatDollarAmount = (num: number, digits: number) => {
	const formatter = new Intl.NumberFormat([], {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
	});
	return formatter.format(num);
};

export const toK = (num: number) => Numeral(num).format("0.[00]a");

export const formattedNum = (number: number, usd = false) => {
	if (Number.isNaN(number) || number === undefined) {
		return usd ? "$0" : 0;
	}
	const num = parseFloat(number.toString());

	if (num > 500000000) {
		return (usd ? "$" : "") + toK(+num.toFixed(0));
	}

	if (num === 0) {
		if (usd) {
			return "$0";
		}
		return 0;
	}

	if (num < 0.0001 && num > 0) {
		return usd ? "< $0.0001" : "< 0.0001";
	}

	if (num > 1000) {
		return usd
			? formatDollarAmount(num, 0)
			: Number(parseFloat(num.toString()).toFixed(0)).toLocaleString();
	}

	if (usd) {
		if (num < 0.1) {
			return formatDollarAmount(num, 4);
		}
		return formatDollarAmount(num, 2);
	}

	return Number(parseFloat(num.toString()).toFixed(4)).toString();
};

export function formattedPercent(dayVolume: string, generalVolume: string) {
	let percent = 0;
	if (dayVolume && generalVolume) {
		percent = parseFloat(
			(
				(Number(dayVolume) * 0.003 * 365 * 100) /
				Number(generalVolume)
			).toString()
		);
	}
	if (!dayVolume && generalVolume) {
		percent = parseFloat(
			((0 * 0.003 * 365 * 100) / Number(generalVolume)).toString()
		);
	}
	if (dayVolume && !generalVolume) {
		percent = parseFloat(
			((Number(dayVolume) * 0.003 * 365 * 100) / Number(dayVolume)).toString()
		);
	}
	if (!dayVolume && !generalVolume) {
		percent = 0;
	}

	if (!percent || percent === 0) {
		return <Text fontWeight={500}>0%</Text>;
	}

	if (percent < 0.0001 && percent > 0) {
		return (
			<Text fontWeight={500} color="green">
				{"< 0.0001%"}
			</Text>
		);
	}

	if (percent < 0 && percent > -0.0001) {
		return (
			<Text fontWeight={500} color="red">
				{"< 0.0001%"}
			</Text>
		);
	}

	const fixedPercent = percent.toFixed(2);
	if (fixedPercent === "0.00") {
		return "0%";
	}
	if (+fixedPercent > 0) {
		if (+fixedPercent > 100) {
			return (
				<Text fontWeight={500} color="green">{`+${percent
					?.toFixed(0)
					.toLocaleString()}%`}</Text>
			);
		}
		return <Text fontWeight={500} color="green">{`+${fixedPercent}%`}</Text>;
	}
	return <Text fontWeight={500} color="red">{`${fixedPercent}%`}</Text>;
}
