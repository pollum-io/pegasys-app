import { blockClient, GET_BLOCKS } from "apollo";
import dayjs from "dayjs";

export function getTimestampsForChanges() {
	const utcCurrentTime = dayjs();
	const t1 = utcCurrentTime.subtract(1, "day").startOf("minute").unix();
	const t2 = utcCurrentTime.subtract(2, "day").startOf("minute").unix();
	const tWeek = utcCurrentTime.subtract(1, "week").startOf("minute").unix();
	return [t1, t2, tWeek];
}

export async function getBlocksFromTimestamps() {
	const [t1, t2, tWeek] = getTimestampsForChanges();

	const timestamps = [t1, t2, tWeek];

	if (timestamps?.length === 0) {
		return [];
	}

	const fetchedData = await blockClient.query({
		query: GET_BLOCKS(timestamps),
		fetchPolicy: "cache-first",
	});

	const blocks = [];
	if (fetchedData) {
		// eslint-disable-next-line
		for (const t in fetchedData.data) {
			// eslint-disable-next-line
			// @ts-ignore
			if (fetchedData.data[t]?.length > 0) {
				blocks.push({
					timestamp: t.split("t")[1],
					// eslint-disable-next-line
					// @ts-ignore
					number: fetchedData.data[t][0].number,
				});
			}
		}
	}

	return blocks;
}
