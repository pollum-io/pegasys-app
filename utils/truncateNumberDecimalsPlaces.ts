export function truncateNumberDecimalsPlaces(value: number, precision = 2) {
	const factor = 10 ** precision;
	return Math.floor(value * factor) / factor;
}
