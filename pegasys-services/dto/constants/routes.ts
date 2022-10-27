import { ChainId, Token } from "@pollum-io/pegasys-sdk";

export type ITokenRoutes = { [chainId in ChainId]: Token };
