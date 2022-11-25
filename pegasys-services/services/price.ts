import { pegasysClient, SYS_PRICE } from "apollo";

class PriceServices {
	static async getSysUsdPrice() {
		const fetchSysPrice = await pegasysClient.query({
			query: SYS_PRICE(),
			fetchPolicy: "cache-first",
		});

		const sysPrice = fetchSysPrice?.data?.bundles[0]?.sysPrice;

		return Number(sysPrice);
	}
}

export default PriceServices;
