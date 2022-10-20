import { isAddress } from "utils";

/**
 * Given a name or address, does a lookup to resolve to an address and name
 * @param nameOrAddress ENS name or address
 */
export function UseENS(nameOrAddress: string): {
	loading: boolean;
	address: string | null;
	name: string | null;
} {
	const validated = isAddress(nameOrAddress);

	return {
		loading: false,
		address: validated || null,
		name: null,
	};
}

const ENS_NAME_REGEX = /^(([a-zA-Z0-9]+\.)+)eth(\/.*)?$/;

export function parseENSAddress(
	ensAddress: string
): { ensName: string; ensPath: string | undefined } | undefined {
	const match = ensAddress.match(ENS_NAME_REGEX);
	if (!match) return undefined;
	return { ensName: `${match[1].toLowerCase()}eth`, ensPath: match[3] };
}
