import { removeScientificNotation } from ".";

// Truncate balance values without around using regex
const truncateNumberWithoutRound = (
	value: number | string,
	precision: number
): string => {
	// eslint-disable-next-line
	const regex = new RegExp(`^-?\\d+(?:\.\\d{0,${precision || -1}})?`);

	// eslint-disable-next-line
	//@ts-ignore -> using because value wont be null, always received at least 0
	const truncatedValue = value.toString().match(regex)[0];

	return truncatedValue;
};

// Get all type of balances BigInt or not, truncate using the correct validation and return value to be set in state
export const verifyZerosInBalanceAndFormat = (balance: number): string => {
	const fullValue = removeScientificNotation(balance);

	const quantityOfZerosAfterDot = -Math.floor(
		Math.log10(fullValue as number) + 1
	);

	const firstNumber = fullValue.toString().charAt(0);

	const secondValueSplitted =
		fullValue > 0 && fullValue.toString().split(".")[1].charAt(0);

	const valuesValidations = [
		Number(firstNumber) === 0 &&
			secondValueSplitted !== false &&
			Number(secondValueSplitted) === 0,
	];

	const defaultPrecisionValidated = secondValueSplitted === false ? 0 : 4;

	const fractionValidation = valuesValidations.every(
		validation => validation === true
	);

	const formattedAndTruncatedValue = truncateNumberWithoutRound(
		fullValue,
		fractionValidation ? quantityOfZerosAfterDot + 1 : defaultPrecisionValidated
	);

	return formattedAndTruncatedValue;
};
