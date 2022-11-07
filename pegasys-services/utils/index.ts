export const onlyNumbers = (str: string) => {
	const onlyNumbers = str.replace(/[^0-9.]/g, "");
	return onlyNumbers;
};

export const typedValue2TokenValue = (value: string) => {
	if (value) {
		const numParts = value.split(".");

		if (numParts.length === 1) {
			return numParts[0] + "0".repeat(18);
		}

		const repeat = numParts[1].length < 18 ? 18 - numParts[1].length : 0;

		return numParts[0] + numParts[1] + "0".repeat(repeat);
	}

	return "0";
};

export * from "./formaters";
