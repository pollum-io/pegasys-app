import { ChainId } from "@pollum-io/pegasys-sdk";
import { TokenList } from "@pollum-io/syscoin-tokenlist-sdk";
import { WrappedTokenInfo } from "types";

export type TokenAddressMap = {
	[chainId in ChainId]: { [tokenAddress: string]: WrappedTokenInfo };
};

export interface ListsState {
	byUrl: {
		[url: string]: {
			readonly current: TokenList | null;
			readonly pendingUpdate: TokenList | null;
			readonly loadingRequestId: string | null;
			readonly error: string | null;
		};
	};
	// this contains the default list of lists from the last time the updateVersion was called, i.e. the app was reloaded
	lastInitializedDefaultListOfLists?: string[];
	selectedListUrl: string[] | null;
}

export type NewListState = ListsState["byUrl"][string];

export type Mutable<T> = {
	-readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P];
};
