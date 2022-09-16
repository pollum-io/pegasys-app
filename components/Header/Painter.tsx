import { FunctionComponent } from "react";

export const Painter: FunctionComponent = () => (
	<svg width="0" height="0">
		<linearGradient id="dark-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
			<stop stopColor="#665EE1" offset="5%" />
			<stop stopColor="#56C0DA" offset="60%" />
			<stop stopColor="#19EDD0" offset="100%" />
		</linearGradient>
		<linearGradient id="light-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
			<stop stopColor="#665EE1" offset="0%" />
			<stop stopColor="#6D9BEE" offset="50%" />
			<stop stopColor="#00B8FF" offset="100%" />
		</linearGradient>
	</svg>
);
