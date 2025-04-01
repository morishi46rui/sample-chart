import { useEffect, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

export const CompareMultipleChart: React.FC = () => {
	const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
		title: {
			text: "株価比較チャート",
		},
		rangeSelector: {
			selected: 4,
		},
		yAxis: {
			opposite: false,
			labels: {
				format: "{value}%",
			},
			plotLines: [
				{
					value: 0,
					width: 2,
					color: "silver",
				},
			],
		},
		plotOptions: {
			series: {
				compare: "percent",
				showInNavigator: true,
			},
		},
		tooltip: {
			pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
			valueDecimals: 2,
			split: true,
		},
		series: [],
	});

	useEffect(() => {
		const fetchData = async () => {
			const names = ["MSFT", "AAPL", "GOOG"];
			const seriesPromises = names.map(async (name) => {
				const response = await fetch(
					`https://cdn.jsdelivr.net/gh/highcharts/highcharts@f0e61a1/samples/data/${name.toLowerCase()}-c.json`
				);
				const data = await response.json();
				return { name, data, type: "line" } as Highcharts.SeriesOptionsType;
			});

			const series = await Promise.all(seriesPromises);

			setChartOptions((prevOptions) => ({
				...prevOptions,
				series: series as Highcharts.SeriesOptionsType[],
			}));
		};

		fetchData();
	}, []);

	return (
		<div>
			<h2>株価比較チャート</h2>
			<HighchartsReact highcharts={Highcharts} constructorType={"stockChart"} options={chartOptions} />
		</div>
	);
};
