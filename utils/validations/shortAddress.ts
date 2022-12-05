export const shortAddress = (address: string) =>
	address ? `${address.substr(0, 5)}…${address.substr(-4)}` : "";
