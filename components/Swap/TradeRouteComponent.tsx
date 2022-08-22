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

	const findTokenLogo = (tokenSymbol: string) => {
		const tokenFind = userTokensBalance.find(
			token => token.symbol === tokenSymbol
		);

		return tokenFind?.tokenInfo.logoURI;
	};

	return transactionRoute?.map((token, index: number) => (
		<Flex key={token.address} alignItems="center">
			<Flex gap="2">
				<Img src={findTokenLogo(token.symbol as string)} w="5" h="5" />
				<Text fontSize="sm">{token.symbol}</Text>
			</Flex>
			{index !== transactionRoute.length - 1 && (
				<Flex mx="3" my="2">
					<Icon as={IoIosArrowForward} />
				</Flex>
			)}
		</Flex>
	));
};
