import { ChainId } from "@pollum-io/pegasys-sdk";
import { TokenList } from "@pollum-io/syscoin-tokenlist-sdk";
import { ListsState, Mutable, NewListState, TokenAddressMap } from "types";
import {
	DEFAULT_TOKEN_LISTS,
	DEFAULT_TOKEN_LISTS_SELECTED,
} from "pegasys-services";

// An empty result, useful as a default token list value.
export const EMPTY_TOKEN_LIST: TokenAddressMap = {
	[ChainId.TANENBAUM]: {},
	[ChainId.NEVM]: {},
	[ChainId.ROLLUX]: {},
};

export const NEW_TOKEN_LIST_STATE: NewListState = {
	error: null,
	current: null,
	loadingRequestId: null,
	pendingUpdate: null,
};

export const tokenListCache: WeakMap<TokenList, TokenAddressMap> | null =
	typeof WeakMap !== "undefined"
		? new WeakMap<TokenList, TokenAddressMap>()
		: null;

export const INITIAL_TOKEN_LIST_STATE: ListsState = {
	byUrl: {
		...DEFAULT_TOKEN_LISTS.reduce<Mutable<ListsState["byUrl"]>>(
			(memo, listUrl) => {
				memo[listUrl] = NEW_TOKEN_LIST_STATE;

				return memo;
			},
			{}
		),
	},
	lastInitializedDefaultListOfLists: DEFAULT_TOKEN_LISTS,
	selectedListUrl: DEFAULT_TOKEN_LISTS_SELECTED,
};
