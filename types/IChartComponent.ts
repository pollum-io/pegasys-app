export interface IChartComponentData {
	open: string;
	high: string;
	low: string;
	close: string;
	time: number;
	period: number;
}

export interface IChartComponentColors {
	backgroundColor: string;
	textColor: string;
	upColor: string;
	downColor: string;
	borderVisible: boolean;
	wickUpColor: string;
	wickDownColor: string;
}
