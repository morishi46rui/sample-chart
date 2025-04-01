import { useState, useMemo, useRef, useEffect } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import HighchartsDraggablePoints from "highcharts/modules/draggable-points";

// モジュールを適用
if (typeof HighchartsDraggablePoints === "function") {
	HighchartsDraggablePoints(Highcharts);
} else {
	console.error("HighchartsDraggablePoints is not a function. Check the module import.");
}

// 株価ダミーデータ生成
const generateRealisticDummyData = () => {
	const data = [];
	const startDate = new Date(2023, 0, 1).getTime();
	const today = new Date().getTime();
	let previousClose = 1200;

	for (let date = startDate; date <= today; date += 24 * 60 * 60 * 1000) {
		const changePercent = (Math.random() - 0.5) * 0.04;
		const close = Math.round(previousClose * (1 + changePercent) * 100) / 100;
		data.push([date, close]);
		previousClose = close;
	}
	return data;
};

// 営業利益データ生成
const generateQuarterlyProfitData = (): { data: [number, number][]; forecastData: [number, number][] } => {
	const data: [number, number][] = [
		[new Date("2022-03-31").getTime(), 100],
		[new Date("2023-03-31").getTime(), 150],
		[new Date("2024-03-31").getTime(), 200],
		[new Date("2025-03-31").getTime(), 250],
		// [new Date("2025-06-31").getTime(), 250],
		// [new Date("2025-09-31").getTime(), 250],
		// [new Date("2025-12-31").getTime(), 250],
	];

	const forecastData: [number, number][] = [
		[new Date("2026-03-31").getTime(), 300],
		[new Date("2026-06-30").getTime(), 350],
		[new Date("2026-09-30").getTime(), 330],
		[new Date("2026-012-31").getTime(), 330],
		[new Date("2027-03-31").getTime(), 350],
	];

	return { data, forecastData };
};

const generateForecastStockPriceData = () => {
	const data: [number, number, number][] = [
		// [new Date("2023-03-31").getTime(), 1200, 550],
		// [new Date("2024-03-31").getTime(), 1300, 0],
		// [new Date("2025-03-31").getTime(), 1400, 0],
		[new Date("2025-06-31").getTime(), 1500, 1000],
		[new Date("2026-06-31").getTime(), 1600, 900],
	];

	return data;
};

export const DraggableStockChart: React.FC = () => {
	const [forecastProfitData, setForecastProfitData] = useState<Array<[number, number]>>([]);

	const [forecastStockPrice, setForecastStockPrice] = useState<Array<[number, number, number]>>(generateForecastStockPriceData());

	console.log("========= forecastStockPrice ==========");
	console.log(forecastStockPrice);

	const chartRef = useRef<HighchartsReact.RefObject>(null);

	const realisticData = useMemo(() => generateRealisticDummyData(), []);
	const { data: profitData, forecastData: initialForecastData } = useMemo(() => generateQuarterlyProfitData(), []);

	useEffect(() => {
		setForecastProfitData(initialForecastData);
	}, [initialForecastData]);

	useEffect(() => {
		const chart = chartRef.current?.chart;
		if (!chart) return;

		const padding = 1000 * 60 * 60 * 24 * 90;
		const extremes = chart.xAxis[0].getExtremes();
		chart.xAxis[0].setExtremes(extremes.min, extremes.max + padding);
	}, []);

	const options: Highcharts.Options = {
		title: { text: "株価と四半期ごとの営業利益データ" },
		xAxis: {
			type: "datetime",
			ordinal: false,
			minRange: 30 * 24 * 60 * 60 * 1000,
		},
		yAxis: [
			{ title: { text: "株価 (円)", align: "high", rotation: 0 }, opposite: false },
			{ title: { text: "営業利益 (十億円)", align: "high", rotation: 0 }, opposite: true },
		],
		series: [
			{ name: "株価", data: realisticData, type: "line", yAxis: 0 },
			{
				name: "営業利益",
				type: "column",
				data: profitData,
				yAxis: 1,
				color: "rgba(0, 0, 255, 0.4)",
				// 棒グラフの右側をデータの日付にしたいため、width分左にずらす
				pointPlacement: -20,
			},
			{
				name: "予想営業利益",
				// data: forecastProfitData,
				// 下記のmapが無いとエラー
				data: forecastProfitData.map(([x, y]) => ({ x, y })),
				type: "column",
				yAxis: 1,
				color: "rgba(255, 165, 0, 0.7)",
				dragDrop: {
					draggableY: true,
				},
				point: {
					events: {
						dragStart: function (e: any) {
							// console.log(`========= dragStart! ==========`);
						},
						drag: function (e: any) {
							console.log("========= drag! ==========");
						},
						drop: function (e: any) {
							setForecastProfitData((prev) => prev.map(([dx, dy]) => (dx === e.target.x ? [dx, e.newPoint.y] : [dx, dy])));
						},
					},
				},
			},
			{
				name: "DCF",
				data: [
					[Date.UTC(2022, 4, 1), 400],
					[Date.UTC(2025, 8, 1), 400],
				],
				type: "line",
				yAxis: 0,
				color: "green",
				dashStyle: "ShortDash",
				dataLabels: {
					enabled: true,
					formatter: function () {
						return this.x === Date.UTC(2022, 4, 1) ? "DCF" : null;
					},
					style: { color: "green", fontWeight: "bold" },
					align: "left",
					verticalAlign: "middle",
					crop: false,
					overflow: "allow",
				},
			},
			{
				name: "PE",
				data: [
					[Date.UTC(2022, 4, 1), 200],
					[Date.UTC(2025, 8, 1), 200],
				],
				type: "line",
				yAxis: 0,
				color: "red",
				dashStyle: "ShortDash",
				dataLabels: {
					enabled: true,
					formatter: function () {
						return this.x === Date.UTC(2022, 4, 1) ? "PE" : null;
					},
					style: { color: "red", fontWeight: "bold" },
					align: "left",
					verticalAlign: "middle",
					crop: false,
					overflow: "allow",
				},
			},
			{
				name: "目標株価",
				data: forecastStockPrice.map(([timestamp, targetPrice]) => [timestamp, targetPrice]),
				type: "line",
				yAxis: 0,
				color: "green",
				dashStyle: "ShortDot",
				marker: { enabled: true, symbol: "circle" },
				dragDrop: {
					draggableY: true, // Y軸方向のドラッグを有効化
				},
				point: {
					events: {
						drag: function (e: any) {
							// console.log(`Dragging target price: x=${e.newX}, y=${e.newY}`);
						},
						drop: function (e: any) {
							setForecastStockPrice((prev) => prev.map(([dx, dt, dr]) => (dx === e.target.x ? [dx, e.newPoint.y, dr] : [dx, dt, dr])));
						},
					},
				},
			},
			{
				name: "リスク値",
				data: forecastStockPrice.map(([timestamp, , riskPrice]) => [timestamp, riskPrice]),
				type: "line",
				yAxis: 0,
				color: "red",
				dashStyle: "ShortDot",
				marker: { enabled: true, symbol: "triangle" },
				dragDrop: {
					draggableY: true, // Y軸方向のドラッグを有効化
				},
				point: {
					events: {
						drag: function (e: any) {
							console.log(`Dragging risk price: x=${e.newX}, y=${e.newY}`);
						},
						drop: function (e: any) {
							console.log(`Dropped risk price: x=${e.newX}, y=${e.newY}`);
							setForecastStockPrice((prev) => prev.map(([dx, dt, dr]) => (dx === e.target.x ? [dx, dt, e.newPoint.y] : [dx, dt, dr])));
						},
					},
				},
			},
		],
		plotOptions: {
			column: {
				pointWidth: 20,
				groupPadding: 0.2,
				pointPadding: 0.1,
			},
			series: {
				dataGrouping: { enabled: false },
			},
		},
		tooltip: {
			shared: true,
			xDateFormat: "%Y/%m/%d",
			pointFormatter: function () {
				return `<span style="color:${this.color ?? "black"}">${this.series?.name ?? "Unknown"}</span>: <b>${
					this.y?.toFixed(1) ?? "N/A"
				}</b><br/>`;
			},
		},
	};

	return (
		<div>
			<h2>目標株価の追加</h2>

			<div style={{ marginBottom: "1rem" }}>
				<h3>予想営業利益</h3>
				<ul>
					{forecastProfitData.map(([timestamp, profit], index) => (
						<li key={timestamp}>
							<label>
								{new Date(timestamp).toLocaleDateString()}：
								<input
									type="number"
									value={profit}
									onChange={(e) => {
										const newProfit = Number.parseFloat(e.target.value);
										if (!Number.isNaN(newProfit)) {
											setForecastProfitData((prev) => prev.map(([dx, dy], i) => (i === index ? [dx, newProfit] : [dx, dy])));
										}
									}}
									style={{ marginLeft: "0.5rem" }}
								/>
								億円
							</label>
						</li>
					))}
				</ul>
			</div>

			<div style={{ marginBottom: "1rem" }}>
				<h3>予想データの追加</h3>
				<ul>
					{forecastStockPrice.map(([timestamp, targetPrice, riskPrice], index) => (
						<li key={timestamp} style={{ marginBottom: "0.5rem" }}>
							<label>
								予想対象日：
								<input
									type="date"
									value={new Date(timestamp).toISOString().split("T")[0]}
									onChange={(e) => {
										const newDate = new Date(e.target.value).getTime();
										setForecastStockPrice((prev) => prev.map(([dx, dt, dr], i) => (i === index ? [newDate, dt, dr] : [dx, dt, dr])));
									}}
									style={{ marginRight: "1rem" }}
								/>
							</label>
							<label>
								目標株価：
								<input
									type="number"
									value={targetPrice}
									onChange={(e) => {
										const newTarget = Number.parseFloat(e.target.value);
										if (!Number.isNaN(newTarget)) {
											setForecastStockPrice((prev) => prev.map(([dx, dt, dr], i) => (i === index ? [dx, newTarget, dr] : [dx, dt, dr])));
										}
									}}
									style={{ marginRight: "1rem" }}
								/>
							</label>
							<label>
								リスク値：
								<input
									type="number"
									value={riskPrice}
									onChange={(e) => {
										const newRisk = Number.parseFloat(e.target.value);
										if (!Number.isNaN(newRisk)) {
											setForecastStockPrice((prev) => prev.map(([dx, dt, dr], i) => (i === index ? [dx, dt, newRisk] : [dx, dt, dr])));
										}
									}}
									style={{ marginRight: "1rem" }}
								/>
							</label>
							<button
								type="button"
								onClick={() => {
									setForecastStockPrice((prev) => prev.filter((_, i) => i !== index));
								}}
								style={{ marginLeft: "1rem", color: "red" }}
							>
								削除
							</button>
						</li>
					))}
				</ul>
				<button
					type="button"
					onClick={() => {
						const newDate = new Date().getTime();
						setForecastStockPrice((prev) => [...prev, [newDate, 0, 0]]);
					}}
				>
					新規追加
				</button>
			</div>

			<HighchartsReact highcharts={Highcharts} constructorType="stockChart" options={options} ref={chartRef} />
		</div>
	);
};

export default DraggableStockChart;
