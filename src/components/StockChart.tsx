import { useState, useMemo, useRef, useEffect } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

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
const generateQuarterlyProfitData = () => {
	const data = [];
	const forecastData = [];
	const startDate = new Date(2022, 4, 1).getTime();
	const quarterDuration = 3 * 30 * 24 * 60 * 60 * 1000;

	for (let i = 0; i < 12; i++) {
		const date = startDate + i * quarterDuration;
		const profit = Math.round((Math.random() * 200 + 200) * 100) / 100;
		data.push([date, profit]);
	}

	for (let i = 12; i < 13; i++) {
		const date = startDate + i * quarterDuration;
		const profit = Math.round((Math.random() * 200 + 200) * 100) / 100;
		forecastData.push([date, profit]);
	}

	return { data, forecastData };
};

export const StockChart: React.FC = () => {
	const [forecastDate, setForecastDate] = useState("");
	const [forecastTargetPrice, setForecastTargetPrice] = useState("");
	const [forecastRiskPrice, setForecastRiskPrice] = useState("");

	const [targetPrices, setTargetPrices] = useState<Array<[number, number]>>([]);
	const [riskPrices, setRiskPrices] = useState<Array<[number, number]>>([]);

	const chartRef = useRef<HighchartsReact.RefObject>(null);

	const realisticData = useMemo(() => generateRealisticDummyData(), []);
	const { data: profitData, forecastData: profitForecastData } = useMemo(() => generateQuarterlyProfitData(), []);

	const handleAddForecast = () => {
		if (!forecastDate) return;

		const date = new Date(forecastDate).getTime();
		const target = Number.parseFloat(forecastTargetPrice);
		const risk = Number.parseFloat(forecastRiskPrice);

		if (!Number.isNaN(target)) {
			setTargetPrices([...targetPrices, [date, target]]);
		}
		if (!Number.isNaN(risk)) {
			setRiskPrices([...riskPrices, [date, risk]]);
		}
	};

	// チャート初期描画後、右端に余白を追加
	useEffect(() => {
		const chart = chartRef.current?.chart;
		if (!chart) return;

		const padding = 1000 * 60 * 60 * 24 * 90; // 90日分
		const extremes = chart.xAxis[0].getExtremes();
		chart.xAxis[0].setExtremes(extremes.min, extremes.max + padding);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const chart = chartRef.current?.chart;
		if (!chart) return;

		let isDragging = false;
		let draggingPoint: Highcharts.Point | null = null;

		const onMouseDown = (e: MouseEvent, point: Highcharts.Point) => {
			isDragging = true;
			draggingPoint = point;
			document.body.style.cursor = "grabbing";
		};

		const onMouseMove = (e: MouseEvent) => {
			if (!isDragging || !draggingPoint) return;
			const chart = chartRef.current?.chart;
			if (!chart) return;

			const chartPosition = chart.pointer.normalize(e);
			const yAxis = draggingPoint.series.yAxis;
			const newValue = yAxis.toValue(chartPosition.chartY);
			draggingPoint.update(newValue, true, false);
		};

		const onMouseUp = () => {
			isDragging = false;
			draggingPoint = null;
			document.body.style.cursor = "";
		};

		const attachDragEvents = () => {
			const draggableSeriesNames = ["予想営業利益", "目標株価", "リスク値"];
			for (const seriesName of draggableSeriesNames) {
				const series = chart.series.find((s) => s.name === seriesName);
				if (series) {
					for (const point of series.points) {
						const el = point.graphic?.element;
						if (!el) continue;
						el.style.cursor = "ns-resize";
						el.onmousedown = (e) => onMouseDown(e as MouseEvent, point); // ← `addEventListener` より確実に更新
					}
				}
			}
		};

		attachDragEvents(); // 初回設定

		chart.redraw(); // 再描画時にもポイント更新

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);

		// ✅ 再描画後にも drag イベントを再アタッチ
		chart.update({}, true, false); // オプション変えずに redraw を誘発

		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		};
	}, [targetPrices, riskPrices]);

	const options: Highcharts.Options = {
		title: {
			text: "株価と四半期ごとの営業利益データ",
		},
		xAxis: {
			type: "datetime",
			ordinal: false,
			minRange: 30 * 24 * 60 * 60 * 1000, // 30日間の最小表示範囲
		},
		yAxis: [
			{
				title: { text: "株価 (円)", align: "high", rotation: 0 },
				opposite: false,
			},
			{
				title: { text: "営業利益 (十億円)", align: "high", rotation: 0 },
				opposite: true,
			},
		],
		series: [
			{
				name: "株価",
				data: realisticData,
				type: "line",
				yAxis: 0,
			},
			{
				name: "営業利益",
				data: profitData,
				type: "column",
				yAxis: 1,
				color: "rgba(0, 0, 255, 0.4)",
			},
			{
				name: "予想営業利益",
				data: profitForecastData,
				type: "column",
				yAxis: 1,
				color: "rgba(255, 165, 0, 0.7)",
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
				data: targetPrices,
				type: "line",
				yAxis: 0,
				color: "green",
				dashStyle: "ShortDot",
				marker: { enabled: true, symbol: "circle" },
			},
			{
				name: "リスク値",
				data: riskPrices,
				type: "line",
				yAxis: 0,
				color: "red",
				dashStyle: "ShortDot",
				marker: { enabled: true, symbol: "triangle" },
			},
		],
		plotOptions: {
			column: {
				pointWidth: 20,
				groupPadding: 0.2,
				pointPadding: 0.1,
			},
			series: {
				dataGrouping: {
					enabled: false,
				},
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
				<label>
					予想対象日：
					<input type="date" value={forecastDate} onChange={(e) => setForecastDate(e.target.value)} style={{ marginRight: "1rem" }} />
				</label>
				<label>
					目標株価：
					<input
						type="number"
						value={forecastTargetPrice}
						onChange={(e) => setForecastTargetPrice(e.target.value)}
						style={{ marginRight: "1rem" }}
					/>
				</label>
				<label>
					リスク値：
					<input
						type="number"
						value={forecastRiskPrice}
						onChange={(e) => setForecastRiskPrice(e.target.value)}
						style={{ marginRight: "1rem" }}
					/>
				</label>
				<button type="button" onClick={handleAddForecast}>
					追加
				</button>
			</div>
			<HighchartsReact highcharts={Highcharts} constructorType="stockChart" options={options} ref={chartRef} />
		</div>
	);
};

export default StockChart;
