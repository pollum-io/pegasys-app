import React, {
	useEffect,
	createContext,
	useState,
	useMemo,
	useLayoutEffect,
} from "react";
import { ethers, Signer } from "ethers";
import { createContractUsingAbi } from "utils/contractInstance";
import { getBalanceOf } from "utils";

interface IWeb3 {
	isConnected: boolean;
	walletAddress: string;
	connectWallet: any;
	error?: boolean;
	setError?: any;
}

export const WalletContext = createContext({} as IWeb3);

declare let window: any;

interface ITokenBalance {
	contract: string;
	balance: string;
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isConnected, setIsConnected] = useState(false);
	const [walletAddress, setAddress] = useState("");
	const [error, setError] = useState<boolean>();
	const [signer, setSigner] = useState<Signer>();
	const [provider, setProvider] = useState<
		ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider
	>();
	const [balances, setBalances] = useState<ITokenBalance[]>([]);

	const connectToSysRpcIfNotConnected = () => {
		const rpcProvider = new ethers.providers.JsonRpcProvider(
			"https://rpc.syscoin.org/" || "https://rpc.ankr.com/syscoin"
		);
		setProvider(rpcProvider);

		const rpcSigner = rpcProvider.getSigner();

		setSigner(rpcSigner);
	};

	const getSignerIfConnected = async () => {
		const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

		await web3Provider.send("eth_requestAccounts", []);

		const web3Signer = web3Provider.getSigner();

		setProvider(web3Provider);
		setSigner(web3Signer);
	};

	const connectWallet = async (connector: any) => {
		connector
			.activate()
			.then(() => {
				if (Number(window?.ethereum?.networkVersion) === 57) {
					setIsConnected(!!window?.ethereum?.selectedAddress);
					setAddress(window?.ethereum?.selectedAddress);
					getSignerIfConnected();
					setError(false);
				} else {
					setError(true);
				}
			})
			.catch((errorMessage: Error) => {
				if (errorMessage) {
					console.log(errorMessage, "errorMessage");
				}
			});
	};

	provider?.on("chainChanged", () =>
		setError(Number(window?.ethereum?.networkVersion) === 57)
	);

	provider?.on("accountsChanged", () =>
		setIsConnected(!!window?.ethereum?.selectedAddress)
	);

	useEffect(() => {
		const verifySysNetwork =
			window?.ethereum?.selectedAddress &&
			Number(window?.ethereum?.networkVersion) === 57;

		if (!isConnected) {
			connectToSysRpcIfNotConnected();
		}

		if (verifySysNetwork) {
			setIsConnected(!!window?.ethereum?.selectedAddress);
			setAddress(window?.ethereum?.selectedAddress);
		}
	}, []);

	const getTokenBalance = async (tokenAddress: string) => {
		const balance = await getBalanceOf(
			tokenAddress,
			walletAddress,
			signer || provider
		);
		const contract = tokenAddress.toLowerCase();
		const searchedBalance = balances.find(item => item.contract === contract);
		if (!searchedBalance) {
			setBalances((previous: ITokenBalance[]) => [
				...previous,
				{ contract, balance },
			]);
		} else {
			searchedBalance.balance = balance;
		}
	};

	useEffect(() => {
		if (!isConnected) return;
		const tokensToFetch = ["0xE18c200A70908c89fFA18C628fE1B83aC0065EA4"];
		tokensToFetch.map(token => getTokenBalance(token));
	}, [isConnected]);

	const providerValue = useMemo(
		() => ({
			isConnected,
			walletAddress,
			connectWallet,
			error,
		}),
		[]
	);

	return (
		<WalletContext.Provider value={providerValue}>
			{children}
		</WalletContext.Provider>
	);
};
