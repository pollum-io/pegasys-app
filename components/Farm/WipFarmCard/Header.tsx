import React, { useMemo } from "react";
import { Flex, Img, Text } from "@chakra-ui/react";

import { usePicasso, useTokens } from "hooks";

import { IHeaderProps } from "./dto";

const Header: React.FC<IHeaderProps> = ({ tokenA, tokenB, extraToken }) => {
	const theme = usePicasso();
	const { userTokensBalance } = useTokens();

	const tokenALogo = useMemo(() => {
		const tokenAWrapped = userTokensBalance.find(
			ut => ut.address === tokenA?.address && tokenA.chainId === ut.chainId
		);

		return tokenAWrapped?.logoURI ?? "";
	}, [userTokensBalance, tokenA]);

	const tokenBLogo = useMemo(() => {
		const tokenBWrapped = userTokensBalance.find(
			ut => ut.address === tokenB?.address && tokenB.chainId === ut.chainId
		);

		return tokenBWrapped?.logoURI ?? "";
	}, [userTokensBalance, tokenB]);

	const extraTokenLogo = useMemo(() => {
		const extraTokenWrapped = userTokensBalance.find(
			ut =>
				ut.address === extraToken?.address && extraToken.chainId === ut.chainId
		);

		return extraTokenWrapped?.logoURI ?? "";
	}, [userTokensBalance, extraToken]);

	return (
		<Flex justifyContent="space-between">
			<Flex gap="2" pt="6">
				<Flex>
					<Img src={tokenALogo} w="6" h="6" />
					<Img src={tokenBLogo} w="6" h="6" />
				</Flex>
				<Text className="text" fontSize="lg" fontWeight="bold">
					{tokenA.symbol}-{tokenB?.symbol ?? ""}
				</Text>
			</Flex>
			{!!extraToken && (
				<Flex
					alignItems="flex-end"
					justifyContent="center"
					w="15%"
					h="3rem"
					backgroundColor={theme.bg.smoothGray}
					borderBottomRadius="full"
				>
					<Img src={extraTokenLogo} w="6" h="6" mb="0.6rem" />
				</Flex>
			)}
		</Flex>
	);
};

export default Header;
