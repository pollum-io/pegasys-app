import { PoolsContext } from "contexts";
import { useContext } from "react";

export function usePools() {
	return useContext(PoolsContext);
}
