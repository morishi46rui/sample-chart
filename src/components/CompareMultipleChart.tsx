import { useEffect, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

const generateDummyData = (startDate: Date, days: number, startValue: number) => {
	const data = [];
	let currentValue = startValue;

	for (let i = 0; i < days; i++) {
		const date = new Date(startDate);
		date.setDate(startDate.getDate() + i);

		// 値をランダムに変動させる
		const change = (Math.random() - 0.5) * 2;
		currentValue = Math.max(0, currentValue + currentValue * (change / 100));

		data.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()), Number.parseFloat(currentValue.toFixed(2))]);
	}

	return data;
};

const dummyInitialValues: Record<string, number> = {
	MSFT: 100,
	AAPL: 150,
	GOOG: 200,
	NVDA: 300,
	TSLA: 180,
	AMZN: 220,
};

export const CompareMultipleChart: React.FC = () => {
	const [seriesNames, setSeriesNames] = useState<string[]>(["MSFT", "AAPL", "GOOG"]);
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
		const startDate = new Date(2020, 0, 1);
		const days = 365 * 3;

		const series = seriesNames.map((name) => {
			const startValue = dummyInitialValues[name] || 100;
			const data = generateDummyData(startDate, days, startValue);
			return {
				name,
				data,
				type: "line",
			};
		});

		setChartOptions((prev) => ({
			...prev,
			series: series as Highcharts.SeriesOptionsType[],
		}));
	}, [seriesNames]);

	const handleAddSeries = () => {
		const candidates = Object.keys(dummyInitialValues).filter((name) => !seriesNames.includes(name));
		if (candidates.length === 0) return alert("追加できる銘柄がありません");

		const nextName = candidates[0];
		setSeriesNames((prev) => [...prev, nextName]);
	};

	return (
		<div>
			<h2>株価比較チャート</h2>
			<button type="button" onClick={handleAddSeries}>銘柄を追加</button>
			<HighchartsReact highcharts={Highcharts} constructorType={"stockChart"} options={chartOptions} />
		</div>
	);
};
