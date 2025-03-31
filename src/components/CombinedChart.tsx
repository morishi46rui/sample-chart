import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export const CombinedChart: React.FC = () => {
	const options: Highcharts.Options = {
		title: {
			text: "折れ線チャートと棒チャートの複合表示",
		},
		xAxis: {
			categories: ["1月", "2月", "3月", "4月", "5月"],
		},
		yAxis: {
			title: {
				text: "値",
			},
		},
		tooltip: {
			shared: true,
		},
		series: [
			{
				type: "column",
				name: "売上（棒）",
				data: [5, 3, 4, 7, 2],
				color: "#7cb5ec",
				pointPadding: 0,
				groupPadding: 0,
			},
			{
				type: "line",
				name: "売上（折れ線）",
				data: [5, 3, 4, 7, 2],
				color: "#f45b5b",
			},
		],
	};

	return (
		<div>
			<HighchartsReact highcharts={Highcharts} options={options} />
		</div>
	);
};
