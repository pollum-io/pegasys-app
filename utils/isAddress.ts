import { getAddress } from "@ethersproject/address";

export const isAddress = (value: string) => getAddress(value as string);
