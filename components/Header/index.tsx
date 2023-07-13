import {
	Flex,
	Icon,
	Img,
	Link,
	Text,
	useColorMode,
	useMediaQuery,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { WalletButton } from "components";
import { IconButton } from "components/Buttons";
import { useModal, usePicasso, useTokens, usePairs as getPairs } from "hooks";
import { MdOutlineCallMade } from "react-icons/md";
import { HiOutlineMenu } from "react-icons/hi";
import { PsysBreakdown } from "components/Modals/PsysBreakdown";
import { useRouter } from "next/router";
import { getTotalSupply, formattedNum } from "utils";
import {
	useWallet,
	usePegasys,
	StakeServices,
	FarmServices,
	ContractFramework,
	RoutesFramework,
	PegasysTokens,
} from "pegasys-services";
import { ChainId, JSBI, Token, TokenAmount } from "@pollum-io/pegasys-sdk";
import { Signer } from "ethers";
import { NavButton } from "./NavButton";
import { NetworkButton } from "./NetworkButton";
import { TokenButton } from "./TokenButton";
import { MenuLinks } from "./MenuLink";
import { SettingsButton } from "./SettingsButton";
import { Painter } from "./Painter";
import { DrawerMenu } from "./DrawerMenu";

export const Header: React.FC = () => {
	const { toggleColorMode, colorMode } = useColorMode();
	const theme = usePicasso();
	const { pathname } = useRouter();
	const {
		isOpenPsysBreakdown,
		onOpenPsysBreakdown,
		onClosePsysBreakdown,
		onOpenDrawerMenu,
		isOpenDrawerMenu,
		onCloseDrawerMenu,
		isOpenMenuLinks,
		isOpenSettingsButton,
	} = useModal();
	const [isMobile] = useMediaQuery("(max-width: 750px)");
	const btnRef: any = React.useRef();
	const { expert } = usePegasys();
	const { address, chainId, provider, signer, isConnected } = useWallet();
	const { userTokensBalance } = useTokens();
	const [unclaimed, setUnclaimed] = useState<TokenAmount>();
	const [psysInfo, setPsysInfo] = useState({
		balance: "0",
		unclaimed: "0",
		price: "0",
		totalSupply: "0",
	});

	const walletInfos = {
		provider,
		walletAddress: address,
		chainId: chainId ?? ChainId.NEVM,
	};

	const PSYS = userTokensBalance.find(token => token.symbol === "PSYS");
	const SYS = userTokensBalance.find(token => token.symbol === "SYS");

	const links = [
		{
			name: "Swap",
			url: "/",
		},
		{
			name: "Pools",
			url: "/pools",
		},
		{
			name: "Farms",
			url: "/farms",
		},
		{
			name: "Stake",
			url: "/stake",
		},
	];
	const stakeContract = useMemo(
		() =>
			ContractFramework.StakeContract({
				chainId,
			}),
		[chainId]
	);

	const farmContract = useMemo(
		() =>
			ContractFramework.FarmContract({
				chainId,
			}),
		[chainId]
	);

	useEffect(() => {
		const getPsys = async () => {
			if (address && chainId && RoutesFramework.getStakeAddress(chainId)) {
				const tokens = PegasysTokens[chainId];

				const psys = tokens.PSYS;

				const unclaimedStakeValue = await StakeServices.getUnclaimed({
					stakeContract,
					chainId,
					walletAddress: address,
					rewardToken: psys,
				});

				const unclaimedFarmValue = await FarmServices.getFarmUnclaimed({
					chainId,
					farmContract,
					walletAddress: address,
				});

				setUnclaimed(
					new TokenAmount(
						psys,
						JSBI.add(unclaimedStakeValue.raw, unclaimedFarmValue.raw)
					)
				);
			}
		};

		getPsys();
	}, [chainId, isConnected, address, stakeContract]);

	useEffect(() => {
		const getPsysInfo = async () => {
			if (PSYS?.formattedBalance !== "0") {
				setPsysInfo(prevState => ({
					...prevState,
					balance: PSYS?.formattedBalance as string,
				}));
			}

			const totalSupply =
				PSYS &&
				signer &&
				provider &&
				(await getTotalSupply(PSYS as Token, signer as Signer, provider));

			const pairs = await getPairs(
				[[PSYS, SYS]] as [Token, Token][],
				walletInfos
			);

			const pair = pairs?.[0]?.[1];

			if (unclaimed?.toSignificant(6) && unclaimed?.toSignificant(6) !== "0") {
				setPsysInfo(prevState => ({
					...prevState,
					unclaimed: unclaimed?.toSignificant(6) as string,
				}));
			}

			setPsysInfo(prevState => ({
				...prevState,
				totalSupply: formattedNum(
					Number(totalSupply?.toSignificant(6))
				) as string,
				price: pair?.priceOf(pair.token1).toSignificant(6) as string,
			}));
		};

		getPsysInfo();
	}, [userTokensBalance, unclaimed]);

	return (
		<Flex
			p="4"
			mt="1"
			mb="16"
			alignItems="center"
			justifyContent="center"
			flexDirection="column"
		>
			<Flex id="header" alignItems="flex-start" w="100%" flexDirection="row">
				<PsysBreakdown
					isOpen={isOpenPsysBreakdown}
					onClose={onClosePsysBreakdown}
					psysUnclaimed={psysInfo.unclaimed || "0"}
					psysBalance={psysInfo.balance || "0"}
					totalSuply={psysInfo.totalSupply || "0"}
					psysPriceSys={psysInfo.price || "0"}
					psys={PSYS}
				/>
				<Link href="/">
					<Img
						w={["7", "8", "8", "8"]}
						h={["7", "8", "8", "8"]}
						src={theme.icon.pegasysLogo}
						ml={["4", "4", "4", "4"]}
						mt={["1.5", "1", "0", "0"]}
						position="absolute"
						left="0"
					/>
				</Link>
				{isMobile ? (
					<Flex
						alignItems="center"
						gap="1"
						position="absolute"
						right="0"
						zIndex="docked"
						mr={["4", "4", "4", "4"]}
						mt={["2", "2", "0", "0"]}
					>
						<Text fontWeight="semibold">Menu</Text>
						<Painter />
						<Icon
							ref={btnRef}
							onClick={onOpenDrawerMenu}
							as={HiOutlineMenu}
							zIndex="99"
							w="6"
							h="6"
							style={
								colorMode === "dark"
									? { stroke: "url(#dark-gradient)" }
									: { stroke: "url(#light-gradient)" }
							}
						/>
						<DrawerMenu isOpen={isOpenDrawerMenu} onClose={onCloseDrawerMenu} />
					</Flex>
				) : (
					<Flex
						gap={["0", "1", "1", "1", "1"]}
						bgColor={theme.bg.blackAlphaTransparent}
						opacity="0.95"
						borderRadius="20"
						ml={["7", "0", "0", "0"]}
					>
						{links.map((item, index) => (
							<NavButton
								key={item.name + Number(index)}
								href={item.url}
								active={pathname === item.url}
							>
								{item.name}
							</NavButton>
						))}
						<NavButton
							href="https://info.pegasys.finance/"
							color={theme.icon.whiteGray}
							customTarget
							display={{
								base: "none",
								sm: "none",
								md: "flex",
								lg: "flex",
							}}
						>
							Charts V1
							<Icon as={MdOutlineCallMade} w="5" h="5" ml="2" />
						</NavButton>
						<NavButton
							href="https://app.pegasys.fi/"
							color={theme.icon.whiteGray}
							customTarget
							display={{
								base: "none",
								sm: "none",
								md: "flex",
								lg: "flex",
							}}
						>
							V3
							<Icon as={MdOutlineCallMade} w="5" h="5" ml="2" />
						</NavButton>
					</Flex>
				)}
			</Flex>
			<Flex flexDirection="column" justifyContent="center" alignItems="center">
				<Flex
					display={["flex", "none", "none", "none"]}
					position="fixed"
					justifyContent="center"
					bottom="3rem"
					zIndex={isOpenSettingsButton || isOpenMenuLinks ? "unset" : "501"}
				>
					<WalletButton />
				</Flex>
				<Flex
					w={["90%", "30rem", "37rem", "37rem"]}
					h="max-content"
					backgroundColor={theme.bg.blackAlpha}
					borderRadius="46px 46px 0px 0px"
					border={theme.border.headerBorder}
					boxShadow={theme.border.headerBorderShadow}
					position="fixed"
					bottom="0"
					zIndex="500"
					alignItems="center"
					px={["0", "10"]}
					pl={expert ? ["8", "6", "10", "10"] : ["6", "6", "10", "10"]}
					pr={expert ? ["6", "6", "10", "10"] : ["4", "4", "10", "10"]}
					py="2"
					justifyContent="space-between"
				>
					<Flex w="25%" gap={["2", "4"]} pl={["0", "2", "0", "0"]}>
						<TokenButton onClick={onOpenPsysBreakdown} />
						<NetworkButton />
					</Flex>
					<Flex
						flexDirection="column"
						pl={["0", "1", "0", "0"]}
						pr={
							address
								? expert
									? ["0", "1rem", "1.5rem", "1.5rem"]
									: ["4rem", "1rem", "2rem", "2rem"]
								: ["4rem", "0", "0", "0.3rem"]
						}
						display={["none", "flex", "flex", "flex"]}
					>
						<WalletButton />
					</Flex>
					<Flex alignContent={["flex-start", "unset", "unset", "unset"]}>
						<Flex>
							<IconButton
								_hover={{
									color: theme.text.cyanPurple,
								}}
								aria-label="Theme"
								icon={<theme.icon.theme size="1.25rem" />}
								onClick={() => toggleColorMode()}
							/>
						</Flex>
						<MenuLinks />
						<SettingsButton />
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};
