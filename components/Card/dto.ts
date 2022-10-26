import React from "react";

export interface CardProps {
	width?: string | number | [string, string, string, string];
	height?: string | number | [string, string, string, string];
	children?: React.ReactNode;
	background?: string;
	border?: string;
	borderRadius?: string;
	px?: string | number;
	py?: string | number;
	pb?: string | number;
	pt?: string | number;
	pl?: string | number;
	pr?: string | number;
	mx?: string | number;
	my?: string | number;
	mb?: string | number;
	mt?: string | number;
	ml?: string | number;
	mr?: string | number;
	gap?: string | number;
	flexDirection?: "column" | "row";
	alignItems?: string | [string, string, string, string];
	boxShadow?: string;
}
