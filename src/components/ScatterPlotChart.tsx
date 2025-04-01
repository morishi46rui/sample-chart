import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import regression from "regression";

export const ScatterPlotChart: React.FC = () => {
	// データポイント
	const dataPoints = [
		{ name: "トヨタ自動車", x: 14.5, y: 1.05 },
		{ name: "本田技研工業", x: 9.0, y: 0.5 },
		{ name: "日産自動車", x: 7.5, y: 0.2 },
		{ name: "スズキ", x: 6.5, y: 0.7 },
		{ name: "マツダ", x: 8.0, y: 0.4 },
		{ name: "SUBARU", x: 10.0, y: 0.6 },
		{ name: "いすゞ自動車", x: 12.0, y: 1.2 },
		{ name: "日野自動車", x: 11.5, y: 1.0 },
		{ name: "三菱自動車工業", x: 8.5, y: 0.3 },
		{ name: "ダイハツ工業", x: 9.5, y: 0.8 },
	];

	// 回帰直線を計算
	const regressionResult = regression.linear(dataPoints.map((point) => [point.x, point.y]));

	const regressionLine = regressionResult.points.map(([x, y]) => [x, y]);

	// チャートオプション
	const options: Highcharts.Options = {
		chart: {
			type: "scatter",
			zooming: {
				type: "xy",
			},
		},
		title: {
			text: "散布図と回帰直線",
		},
		xAxis: {
			title: {
				text: "ROE（前期）",
			},
		},
		yAxis: {
			title: {
				text: "PBR",
			},
		},
		tooltip: {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			formatter: function (this: any) {
				// 一時的に any を使用
				return `<b>${this.point.name}</b><br/>X: ${this.x}<br/>Y: ${this.y}`;
			},
		},
		series: [
			{
				type: "scatter",
				name: "データポイント",
				data: dataPoints.map((point) => ({
					x: point.x,
					y: point.y,
					name: point.name,
				})),
				marker: {
					radius: 5,
				},
			},
			{
				type: "line",
				name: "回帰直線",
				data: regressionLine,
				color: "green",
				marker: {
					enabled: false,
				},
				dashStyle: "Solid",
				enableMouseTracking: false,
			},
		],
		annotations: [
			{
				labels: [
					{
						point: {
							x: regressionLine[1][0],
							y: regressionLine[1][1],
							xAxis: 0,
							yAxis: 0,
						},
						text: `R² = ${regressionResult.r2.toFixed(2)}`,
					},
				],
			},
		],
	};

	return (
		<div>
			<h2>散布図と回帰直線</h2>
			<HighchartsReact highcharts={Highcharts} options={options} />
		</div>
	);
};
