import { Flex, Img, Text, Icon } from "@chakra-ui/react";
import { IoIosArrowForward } from "react-icons/io";
import { FunctionComponent } from "react";
import { WrappedTokenInfo } from "types";
import { useTokens } from "hooks";
import { Token } from "@pollum-io/pegasys-sdk";

interface ITransactionRoute {
	transactionRoute: WrappedTokenInfo[] | Token[] | undefined;
}

export const TradeRouteComponent: FunctionComponent<
	ITransactionRoute
> = props => {
	const { transactionRoute } = props;
	const { userTokensBalance } = useTokens();

	return (
		<Flex>
			{transactionRoute &&
				transactionRoute.map((token, index: number) => (
					<Flex key={token.address} alignItems="center">
						<Flex gap="2">
							<Img
								src={
									token.symbol === "WSYS"
										? userTokensBalance[0]?.tokenInfo?.logoURI
										: token.symbol === "PSYS"
										? userTokensBalance[1]?.tokenInfo?.logoURI
										: token?.tokenInfo?.logoURI
								}
								w="5"
								h="5"
							/>
							<Text fontSize="sm">{token.symbol}</Text>
						</Flex>
						{index !== transactionRoute.length - 1 && (
							<Flex mx="3" my="2">
								<Icon as={IoIosArrowForward} />
							</Flex>
						)}
					</Flex>
				))}
		</Flex>
	);
};
