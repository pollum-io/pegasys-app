import React from "react";
import {
	TokensProvider,
	TokensListManageProvider,
	ModalsProvider,
} from "contexts";
import { PegasysProvider } from "pegasys-services";
import { usePicasso } from "hooks";

const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const theme = usePicasso();

	return (
		<PegasysProvider
			toasty={{
				bg: theme.bg.blackAlpha,
				text: theme.text.mono,
			}}
		>
			<TokensListManageProvider>
				<TokensProvider>
					<ModalsProvider>{children}</ModalsProvider>
				</TokensProvider>
			</TokensListManageProvider>
		</PegasysProvider>
	);
};

export default AppWrapper;
