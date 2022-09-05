import { VoteContainer, DefaultTemplate } from "container";
import type { NextPage } from "next";

const Vote: NextPage = () => (
	<DefaultTemplate widthValue="100%" heightValue="100vh">
		<VoteContainer />
	</DefaultTemplate>
);
export default Vote;
