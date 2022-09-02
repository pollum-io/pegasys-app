/**
 * Given a URI that may be ipfs, ipns, http, or https protocol, return the fetch-able http(s) URLs for the same content
 * @param uri to convert to fetch-able http url
 */

export function returnConvertedUrl(url: string): string[] {
	const protocol = url.split(":")[0].toLowerCase();
	switch (protocol) {
		case "https": {
			return [url];
		}
		case "http": {
			return [`https${url.substr(4)}`, url];
		}

		case "ipfs": {
			const hash = url.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
			return [
				`https://cloudflare-ipfs.com/ipfs/${hash}/`,
				`https://ipfs.io/ipfs/${hash}/`,
			];
		}

		case "ipns": {
			const name = url.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
			return [
				`https://cloudflare-ipfs.com/ipns/${name}/`,
				`https://ipfs.io/ipns/${name}/`,
			];
		}

		default: {
			return [];
		}
	}
}
