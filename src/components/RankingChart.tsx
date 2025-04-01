import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export const RankingChart: React.FC = () => {
	const salesValues = [3200, 3400, 3600, 3800, 4200];
	const percentages = [30, 35, 10, 15, 5];

	const options: Highcharts.Options = {
		chart: {
			type: "bar",
		},
		title: {
			text: "",
		},
		xAxis: {
			reversed: false,
			title: {
				text: "売上高",
			},
			type: "linear",
			labels: {
				formatter: function () {
					return this.value.toString();
				},
			},
			plotLines: [
				{
					value: 4000,
					color: "red",
					width: 2,
					dashStyle: "Dash",
				},
				{
					value: 3750,
					color: "blue",
					width: 2,
					dashStyle: "Dash",
				},
			],
		},
		yAxis: {
			min: 0,
			max: 100,
			title: {
				text: "%",
			},
		},
		legend: {
			enabled: false,
		},
		series: [
			{
				name: "売上高",
				type: "bar",
				data: salesValues.map((x, i) => ({
					x,
					y: percentages[i],
				})),
				color: "#7cb5ec",
			},
		],
	};

	return <HighchartsReact highcharts={Highcharts} options={options} />;
};
