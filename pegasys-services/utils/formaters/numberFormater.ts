export const formatBigNumbers = (number: number) => {
	const formattedNumber = new Intl.NumberFormat().format(number);

	return formattedNumber;
};
