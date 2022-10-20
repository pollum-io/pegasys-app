import { Text } from "@chakra-ui/react";
import { parseENSAddress } from "hooks";
import { useMemo } from "react";

interface ITokenListNameParsed {
	listUrl: string;
}

export const TokenListNameOrigin = ({ listUrl }: ITokenListNameParsed) => {
	const ensName = useMemo(() => parseENSAddress(listUrl)?.ensName, [listUrl]);
	const host = useMemo(() => {
		if (ensName) return undefined;
		const lowerListUrl = listUrl.toLowerCase();
		if (
			lowerListUrl.startsWith("ipfs://") ||
			lowerListUrl.startsWith("ipns://")
		) {
			return listUrl;
		}
		try {
			const url = new URL(listUrl);
			return url.host;
		} catch (error) {
			return undefined;
		}
	}, [listUrl, ensName]);

	// eslint-disable-next-line
	return <>{ensName ?? host}</>;
};
